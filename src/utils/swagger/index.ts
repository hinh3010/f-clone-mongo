import { type Application, type Request, type Response } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { version } from '../../../package.json'
import Logger from '../../@loggers'
import * as swaggerDocument from './swagger.json'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TypeScript-NodeJS-HelloCacBanTre-App',
      version,
      description: 'TypeScript-NodeJS-HelloCacBanTre-App',
      license: {
        name: 'HelloCacBanTre',
        url: '#'
      }
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/index.ts', './src/schema/*.ts']
}

const swaggerSpec = swaggerJsdoc(options)

function swaggerDocs(app: Application, port: number): void {
  // Swagger page
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  // app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

  // Docs in JSON format
  app.get('/swagger.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })

  Logger.info(`[Swagger_Start:::] http://localhost:${port}/swagger`)
}

export default swaggerDocs
