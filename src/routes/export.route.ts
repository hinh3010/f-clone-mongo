import { type IContext } from '@hellocacbantre/context'
import { BaseRouter } from './base.router'
import { ExportController } from '../controllers/export.controller'

export class ExportRouter extends BaseRouter {
  private readonly controller: ExportController

  constructor(context: IContext) {
    super(context)
    this.controller = new ExportController(context)
  }

  protected configureRoutes(): void {
    this.router.route('/excel').get(this.controller.exportExcel)
    this.router.route('/csv').get(this.controller.exportCsv)
  }
}
