import {TypeOrmModule} from '@nestjs/typeorm'
import {DynamicModule} from '@nestjs/common'
import {ConfigService} from "./services/config/config.service";
import {User} from "./entities/user.entity";
import {Auth} from "./entities/auth.entity";
import { StructuredLogger } from './services/logger';

export const DefaultDatabaseConfiguration = (): DynamicModule => {
    const config = new ConfigService()
    // for (let i = 0; i< 100; i++) {
    //         StructuredLogger.info('database connection', 'DefaultDatabaseConfiguration', {message: 'connecting to database'})

    // }
    console.log({
            host: config.get('host'),
            port: config.get('port'),
            type: 'mysql',
            database: config.get('db'),
            username: config.get('db_user_name'),
            password: config.get('db_user_password'),
            synchronize: true,
            migrationsRun: false,
            entities: [User, Auth],
            subscribers: [],
            logging: ['warn', 'error'],
            autoLoadEntities: true,
            retryAttempts: 4,
            retryDelay: 3000,
            keepConnectionAlive: false,
        })
    return TypeOrmModule.forRootAsync({
        imports: [],
        useFactory: () => ({
            host: config.get('host'),
            port: config.get('port'),
            type: 'mysql',
            database: config.get('db'),
            username: config.get('db_user_name'),
            password: config.get('db_user_password'),
            synchronize: true,
            migrationsRun: false,
            entities: [User, Auth],
            subscribers: [],
            logging: ['warn', 'error'],
            autoLoadEntities: true,
            retryAttempts: 4,
            retryDelay: 3000,
            keepConnectionAlive: false,
        })
    })
}
