import { type IContext } from '@hellocacbantre/context'
import Excel from 'exceljs'
import { headerStore, headerSummary, storesStatistic, summaryStatistic } from './fakeDb'
import { sellerHeader, sellerStatistic } from './fakeDbCsv'

interface IExportAction {
  exportExcel: (context: IContext) => () => Promise<Excel.Workbook>
}

interface IOptionStyleSheet {
  bgColor?: string
  borderColor?: string
  textColor?: string
  height?: number
  isApply?: boolean
}

interface IOptionCreateSheet {
  sheetName: string
  columns: any[]
  data: any[]
  isMerge?: boolean
}

interface IOptionStyleCell {
  bgColor?: string
  borderColor?: string
  textColor?: string
}

export class ExportAction implements IExportAction {
  private readonly _styleCell = (cell: Excel.Cell, options: IOptionStyleCell) => {
    const { bgColor, borderColor, textColor } = options ?? {}

    // Set color for row, default for header
    if (bgColor) {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgColor },
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

    if (textColor) {
      cell.font = {
        color: { argb: textColor }
      }
    }

    return cell
  }

  private readonly _styleSheet = (row: Excel.Row, options: IOptionStyleSheet) => {
    const { bgColor, borderColor, height, textColor, isApply = true } = options ?? {}

    // Set color for row,
    if (isApply) {
      row.eachCell((cell: Excel.Cell) => {
        if (bgColor) {
          this._styleCell(cell, { bgColor })
        }
        if (borderColor) {
          this._styleCell(cell, { borderColor })
        }

        if (textColor) {
          this._styleCell(cell, { textColor })
        }
      })
    }

    if (height) row.height = 30

    row.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true
    }
  }

  private readonly _createSheet = (workbook: Excel.Workbook, options: IOptionCreateSheet) => {
    const { sheetName, columns, data, isMerge } = options ?? {}

    // create the worksheet
    const worksheet = workbook.addWorksheet(sheetName)

    // add columns
    worksheet.columns = columns

    // Set color for header
    this._styleSheet(worksheet.getRow(1), { bgColor: '40bff5', borderColor: '000000', height: 20 })

    // add rows
    if (isMerge) {
      data.forEach((rowData) => {
        const { details, ...other } = rowData
        const detailsCount: number = details.length
        const startIndex: number = worksheet.rowCount + 1
        const endIndex = startIndex + detailsCount - 1

        worksheet.addRow({ ...other, productType: details[0].productType, cashbackDetail: details[0].cashback })
        for (let i = 1; i < detailsCount; i++) {
          worksheet.addRow({ productType: details[i].productType, cashbackDetail: details[i].cashback })
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
      data.forEach((rowData, i) => {
        const row = worksheet.addRow(rowData)
        // Set color for row
        this._styleSheet(row, { bgColor: 'eeeeee', borderColor: '000000', isApply: i % 2 !== 0 })
      })
    }

    return worksheet
  }

  public exportExcel(context: IContext) {
    return async () => {
      // initialize the workbook
      const workbook = new Excel.Workbook()

      this._createSheet(workbook, {
        sheetName: 'Summary',
        columns: headerSummary,
        data: summaryStatistic,
        isMerge: true
      })

      storesStatistic.forEach((store) => {
        this._createSheet(workbook, {
          sheetName: store.id,
          columns: headerStore,
          data: store.statistic
        })
      })

      return workbook
    }
  }

  public exportCsv(context: IContext) {
    return async () => {
      // initialize the workbook
      const workbook = new Excel.Workbook()
      const worksheet = workbook.addWorksheet('My Sheet')

      worksheet.addRow(sellerHeader)
      sellerStatistic.forEach((statistic) => {
        worksheet.addRow([statistic.store, statistic.orderCode, statistic.buyerPaidAt, statistic.sellerPaidAt, statistic.productType, statistic.variantTitle, statistic.quantity, statistic.cashback])
      })

      return workbook
    }
  }
}
