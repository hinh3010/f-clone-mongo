import { type IContext } from '@hellocacbantre/context'
import Excel from 'exceljs'
import { headerStore, headerSummary, storesStatistic, summaryStatistic } from './fakeDb'

interface IExportAction {
  exportExcel: (context: IContext) => () => Promise<Excel.Workbook>
}

interface IOptionStyleSheet {
  rowNumber?: number
  fgColor?: string
  bgColor?: string
  borderColor?: string
}

interface IOptionCreateSheet {
  sheetName: string
  columns: any[]
  data: any[]
  isMerge?: boolean
}

export class ExportAction implements IExportAction {
  private readonly styleSheet = (worksheet: Excel.Worksheet, options: IOptionStyleSheet) => {
    const { rowNumber = 1, fgColor, bgColor, borderColor } = options ?? {}

    // Set color for row, default for header
    worksheet.getRow(rowNumber).eachCell((cell: Excel.Cell) => {
      if (bgColor ?? fgColor) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fgColor },
          bgColor: { argb: bgColor }
        }
      }
      if (borderColor) {
        cell.border = {
          top: { style: 'thin', color: { argb: borderColor } },
          left: { style: 'thin', color: { argb: borderColor } },
          bottom: { style: 'thin', color: { argb: borderColor } },
          right: { style: 'thin', color: { argb: borderColor } }
        }
      }
    })
  }

  private readonly createSheet = (workbook: Excel.Workbook, options: IOptionCreateSheet) => {
    const { sheetName, columns, data, isMerge } = options ?? {}

    // create the worksheet
    const worksheet = workbook.addWorksheet(sheetName)

    // add columns
    worksheet.columns = columns

    // add rows
    if (isMerge) {
      data.forEach((rowData) => {
        const { description, storeId, URL, time, cashback, paid, link, condition } = rowData
        const descriptionCount: number = description.length
        const startIndex: number = worksheet.rowCount + 1
        const endIndex = startIndex + descriptionCount - 1

        worksheet.addRow({ storeId, URL, time, cashback, paid, link, condition, description: description[0] })
        for (let i = 1; i < descriptionCount; i++) {
          worksheet.addRow({ description: description[i] })
        }

        // merge cells for the current group of rows
        const keysLength = Object.keys(rowData).length
        for (let i = 0; i < keysLength; i++) {
          const currPosition = i + 1
          if (currPosition === keysLength) return
          worksheet.mergeCells(startIndex, currPosition, endIndex, currPosition)
          worksheet.getCell(startIndex, currPosition).alignment = { horizontal: 'left', vertical: 'middle', wrapText: true }
        }
      })
    } else {
      data.forEach((rowData) => {
        const row = worksheet.addRow(rowData)
        row.eachCell((cell) => {
          cell.alignment = { horizontal: 'left', vertical: 'top', wrapText: true }
        })
      })
    }

    // Set color for header
    this.styleSheet(worksheet, { fgColor: 'FF0070C0', bgColor: 'FF0070C0', borderColor: 'FF00FF00' })

    return worksheet
  }

  public exportExcel(context: IContext) {
    return async () => {
      // initialize the workbook
      const workbook = new Excel.Workbook()

      this.createSheet(workbook, {
        sheetName: 'Summary',
        columns: headerSummary,
        data: summaryStatistic,
        isMerge: true
      })

      storesStatistic.forEach((store) => {
        this.createSheet(workbook, {
          sheetName: store.id,
          columns: headerStore,
          data: store.statistic
        })
      })

      return workbook
    }
  }
}
