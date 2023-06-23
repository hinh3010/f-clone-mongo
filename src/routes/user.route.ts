import { AuthRole } from '@hellocacbantre/auth-role'
import { type IContext } from '@hellocacbantre/context'
import { type Request, type Response } from 'express'
import { UserController } from '../controllers/user.controller'
import { BaseRouter } from './base.router'

const ROUTER_NAME = 'users'

export class UserRouter extends BaseRouter {
  private readonly authRole: AuthRole
  private readonly userCtl: UserController

  constructor(context: IContext) {
    super(context)
    this.userCtl = new UserController(context)
    this.authRole = new AuthRole(context)
  }

  protected configureRoutes(): void {
    const { userCtl, authRole } = this

    this.router.get('/', (req: Request, res: Response) => {
      res.json({
        message: `welcome service ${ROUTER_NAME}`
      })
    })
    this.router.route('/users').get(authRole.isUser, userCtl.getListUser)
  }

  // routes(): void {
  //   const { userCtl, authRole } = this

  //   this.router.get('/', (req: Request, res: Response) => {
  //     res.json({
  //       message: `welcome service ${ROUTER_NAME}`
  //     })
  //   })
  //   this.router.route('/users').get(
  //     // passportService.authenticate('jwt', { session: false }),
  //     authRole.isUser,
  //     userCtl.getListUser
  //   )

  //   // this.router.route('/login').post(passportService.authenticate('local', { session: false }), userCtl.login)

  //   // // Configure the Facebook authentication route
  //   // this.router.route('/login/facebook').post(
  //   //   passportService.authenticate('facebook', {
  //   //     session: false,
  //   //     scope: ['email profile']
  //   //   }),
  //   //   (req, res) => {
  //   //     return res.json({
  //   //       status: 200,
  //   //       message: 'login success'
  //   //     })
  //   //   }
  //   // )

  //   // // Configure the Facebook authentication callback route
  //   // this.router.route('/login/facebook/callback').post(
  //   //   passportService.authenticate('facebook', {
  //   //     session: false,
  //   //     failureRedirect: '/login/failed'
  //   //   }),
  //   //   (req, res) => {
  //   //     return res.json({
  //   //       status: 200,
  //   //       message: 'login success'
  //   //     })
  //   //   }
  //   // )

  //   // this.router.route('/login/google').post(
  //   //   passportService.authenticate('google', {
  //   //     session: false,
  //   //     scope: ['profile', 'email']
  //   //   }),
  //   //   (req, res) => {
  //   //     return res.json({
  //   //       status: 200,
  //   //       message: 'login success'
  //   //     })
  //   //   }
  //   // )
  //   // this.router.route('/login/google/callback').post(
  //   //   passportService.authenticate('google', {
  //   //     session: false,
  //   //     failureRedirect: '/login/failed'
  //   //   }),
  //   //   (req, res) => {
  //   //     return res.json({
  //   //       status: 200,
  //   //       message: 'login success'
  //   //     })
  //   //   }
  //   // )

  //   // this.router.route('/login/failed').post((req, res) => {
  //   //   return res.json({
  //   //     status: 200,
  //   //     message: 'login failed'
  //   //   })
  //   // })
  // }
}
