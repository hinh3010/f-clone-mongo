import { type IContext } from '@hellocacbantre/context'
import Excel from 'exceljs'
import { data } from './fakeDb'

interface IExportAction {
  exportExcel: (context: IContext) => () => Promise<Excel.Workbook>
}

export class ExportAction implements IExportAction {
  private readonly createSheet = (workbook: Excel.Workbook, sheetName: string, columns: any[], data: any[]) => {
    // create the worksheet
    const worksheet = workbook.addWorksheet(sheetName)

    // add columns
    worksheet.columns = columns

    // add rows
    data.forEach((rowData) => {
      worksheet.addRow(rowData)
    })

    // Set color for header
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF0070C0' },
        bgColor: { argb: 'FF0070C0' }
      }
    })

    return worksheet
  }

  private readonly mergeExcelCells = (workbook: Excel.Workbook, sheetData: any[]) => {
    // create the worksheet
    const worksheet = workbook.addWorksheet('Sheet Merge Excel')

    // add columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Email', key: 'email', width: 30 }
    ]

    // add rows
    sheetData.forEach((rowData) => {
      const { email, name, age } = rowData
      const emailCount: number = email.length
      const startIndex: number = worksheet.rowCount + 1
      const endIndex = startIndex + emailCount - 1
      worksheet.addRow({ name, age, email: email[0] })
      for (let i = 1; i < emailCount; i++) {
        worksheet.addRow({ email: email[i] })
      }

      // merge cells for the current group of rows
      worksheet.mergeCells(startIndex, 1, endIndex, 1) // merge "Name" column cells
      worksheet.mergeCells(startIndex, 2, endIndex, 2) // merge "Age" column cells
      worksheet.getCell(startIndex, 1).alignment = { horizontal: 'left', vertical: 'top' } // set alignment for merged cells
    })

    return worksheet
  }

  private readonly simpleSheet = (workbook: Excel.Workbook) => {
    // create the worksheet
    const worksheet = workbook.addWorksheet('Simple Sheet')

    // add columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Email', key: 'email', width: 30 }
    ]

    // add rows
    worksheet.addRow({ email: 'john.doe@example.com', name: 'John Doe', age: 30 })
    worksheet.addRow({ name: 'Jane Doe', age: 25, email: 'jane.doe@example.com' })

    return worksheet
  }

  private readonly highSheet = (workbook: Excel.Workbook) => {
    // create the worksheet
    const worksheet = workbook.addWorksheet('High Sheet')

    // add columns
    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Email', key: 'email', width: 30 }
    ]

    const data = [
      { email: 'john.doe@example.com', name: 'John Doe', age: 24 },
      { email: 'john.doe2@example.com', name: 'John Doe', age: 24 },
      { email: 'john.adu@example.com', name: 'John Adu', age: 22 },
      { email: 'john.doe@example.com', name: 'John Doe', age: 24 },
      { email: 'john.doe2@example.com', name: 'John Doe', age: 24 },
      { email: 'john.adu@example.com', name: 'John Adu', age: 22 },
      { email: 'john.doe@example.com', name: 'John Doe', age: 24 },
      { email: 'john.doe2@example.com', name: 'John Doe', age: 24 },
      { email: 'john.adu@example.com', name: 'John Adu', age: 22 }
    ]

    // add rows
    data.forEach((rowData) => {
      worksheet.addRow(rowData)
    })

    // merge rows based on the value of the "Name" column
    let currentName: string | null = null
    let startRowIndex: number | null = null
    worksheet.getColumn('name').eachCell((cell: Excel.Cell, rowIndex) => {
      if (cell.value !== currentName) {
        if (startRowIndex !== null && rowIndex - startRowIndex > 1) {
          worksheet.mergeCells(startRowIndex, Number(cell.col), rowIndex - 1, Number(cell.col))
          const mergeRange = worksheet.getCell(startRowIndex, worksheet.getColumn('name').number)
          mergeRange.alignment = { horizontal: 'left', vertical: 'top' }
        }
        currentName = cell.value as string
        startRowIndex = rowIndex
      }
    })
    if (startRowIndex !== null && worksheet.rowCount - startRowIndex > 1) {
      worksheet.mergeCells(startRowIndex, worksheet.getColumn('name').number, worksheet.rowCount, worksheet.getColumn('name').number)
    }

    return worksheet
  }

  private readonly mergeCell = (workbook: Excel.Workbook) => {
    // create the worksheet
    const worksheet = workbook.addWorksheet('Merge Cell for Sheet')

    // Add main row
    worksheet.mergeCells('A1:B1')
    worksheet.getCell('A1').value = 'info'

    // Add sub-rows
    worksheet.addRow(['Họ tên', 'Email'])
    worksheet.addRow(['John Doe', 'john.doe@example.com'])
    worksheet.addRow(['Jane Doe', 'jane.doe@example.com'])

    return worksheet
  }

  exportExcel(context: IContext) {
    return async () => {
      // initialize the workbook
      const workbook = new Excel.Workbook()

      // this.highSheet(workbook)

      this.mergeExcelCells(workbook, data)

      this.createSheet(
        workbook,
        'My First Sheet',
        [
          { header: 'Name', key: 'name', width: 20 },
          { header: 'Age', key: 'age', width: 10 },
          { header: 'Email', key: 'email', width: 30 }
        ],
        [
          { name: 'John Doe', age: 30, email: 'john.doe@example.com' },
          { name: 'Jane Doe', age: 25, email: 'jane.doe@example.com' }
        ]
      )

      return workbook
    }
  }
}
