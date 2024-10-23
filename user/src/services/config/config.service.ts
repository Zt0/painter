import { Transport } from '@nestjs/microservices';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      port: process.env.USER_SERVICE_PORT,
    };
    this.envConfig.host = process.env.DB_SQL_LOCAL_HOST;
    this.envConfig.port = process.env.DB_SQL_LOCAL_PORT;
    this.envConfig.db = process.env.DB_SQL_NAME;
    this.envConfig.db_user_name = process.env.DB_SQL_USERNAME;
    this.envConfig.db_user_password = process.env.DB_SQL_USERNAME;
    this.envConfig.baseUri = process.env.BASE_URI;
    this.envConfig.gatewayPort = process.env.API_GATEWAY_PORT;
    this.envConfig.mailerService = {
      options: {
        port: process.env.MAILER_SERVICE_PORT,
        host: process.env.MAILER_SERVICE_HOST,
      },
      transport: Transport.TCP,
    };
    this.envConfig.REFRESH_TOKEN_DURATION = process.env.REFRESH_TOKEN_DURATION
    this.envConfig.JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
