export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
    };
    this.envConfig.host = process.env.DB_SQL_LOCAL_HOST;
    this.envConfig.port = process.env.DB_SQL_LOCAL_PORT;
    this.envConfig.db = process.env.DB_SQL_NAME;
    this.envConfig.db_user_name = process.env.DB_SQL_USERNAME;
    this.envConfig.db_user_password = process.env.DB_SQL_USERNAME;
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
