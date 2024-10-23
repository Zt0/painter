import {TypeOrmModule} from '@nestjs/typeorm'
import {DynamicModule} from '@nestjs/common'
import {ConfigService} from "./services/config/config.service";

export const DefaultDatabaseConfiguration = (): DynamicModule => {
    console.log(3434)
    const config = new ConfigService()
    console.log({
        host: config.get('host'),
        port: config.get('port'),
        type: 'mysql',
        database: config.get('db'),
        username: config.get('db_user_name'),
        password: config.get('db_user_password'),
        synchronize: false,
        migrationsRun: false,
        entities: [],
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
            synchronize: false,
            migrationsRun: false,
            entities: [],
            subscribers: [],
            logging: ['warn', 'error'],
            autoLoadEntities: true,
            retryAttempts: 4,
            retryDelay: 3000,
            keepConnectionAlive: false,
        })
    })
}
