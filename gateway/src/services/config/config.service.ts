import { Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv'
dotenv.config()
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.api_gateway_port = process.env.API_GATEWAY_PORT;
    this.envConfig.tokenService = {
      options: {
        port: process.env.TOKEN_SERVICE_PORT,
        host: process.env.TOKEN_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.gcp_storage = process.env.GCP_STORAGE;
    this.envConfig.POLLIN_FIREBASE_ADMINSDK_SA = process.env.POLLIN_FIREBASE_ADMINSDK_SA;
    this.envConfig.LOGGING_ACCOUNT = process.env.LOGGING_ACCOUNT;
    this.envConfig.host = process.env.DB_SQL_LOCAL_HOST;
    this.envConfig.port = process.env.DB_SQL_LOCAL_PORT;
    this.envConfig.db = process.env.DB_SQL_NAME;
    this.envConfig.db_user_name = process.env.DB_SQL_USERNAME;
    this.envConfig.db_user_password = process.env.DB_SQL_PASSWORD;
    this.envConfig.userService = {
      options: {
        port: 7001,
        host: '0.0.0.0',
      },
      transport: Transport.TCP,
    };
    this.envConfig.taskService = {
      options: {
        port: 7002,
        host: '0.0.0.0',
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
