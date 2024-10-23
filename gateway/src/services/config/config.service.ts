import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv'
dotenv.config()
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    console.log(325252, process.env.API_GATEWAY_PORT)
    this.envConfig = {};
    this.envConfig.api_gateway_port = process.env.API_GATEWAY_PORT;
    this.envConfig.tokenService = {
      options: {
        port: process.env.TOKEN_SERVICE_PORT,
        host: process.env.TOKEN_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.host = process.env.DB_SQL_LOCAL_HOST;
    this.envConfig.port = process.env.DB_SQL_LOCAL_PORT;
    this.envConfig.db = process.env.DB_SQL_NAME;
    this.envConfig.db_user_name = process.env.DB_SQL_USERNAME;
    this.envConfig.db_user_password = process.env.DB_SQL_USERNAME;
    this.envConfig.userService = {
      options: {
        port: 7001,
        host: '0.0.0.0',
      },
      transport: Transport.TCP,
    };
    this.envConfig.taskService = {
      options: {
        port: process.env.TASK_SERVICE_PORT,
        host: process.env.TASK_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.permissionService = {
      options: {
        port: process.env.PERMISSION_SERVICE_PORT,
        host: process.env.PERMISSION_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
