import { type Request, type Response } from 'express'
import catchAsync from '../middlewares/catchAsync'
import { type IContext } from '@hellocacbantre/context'
import { ExportAction } from '../actions/export.action'

export class ExportController {
  private readonly context: IContext
  private readonly exportAction: ExportAction

  constructor(context: IContext) {
    this.exportAction = new ExportAction()
    this.context = context
  }

  exportExcel = catchAsync(async (req: Request, res: Response) => {
    const workbook = await this.exportAction.exportExcel(this.context)()

    // Set the response headers to indicate that the response is an Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', 'attachment; filename=my-file.xlsx')

    // Write the workbook to the response
    // await workbook.xlsx.writeBuffer()
    return workbook.xlsx.write(res)
  })
}
