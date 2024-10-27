import {TypeOrmModule} from '@nestjs/typeorm'
import {DynamicModule} from '@nestjs/common'
import {ConfigService} from "./services/config/config.service";
import { Post } from './entities/post.entity';

export const DefaultDatabaseConfiguration = (): DynamicModule => {
    const config = new ConfigService()

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
            entities: [Post],
            subscribers: [],
            logging: ['warn', 'error'],
            autoLoadEntities: true,
            retryAttempts: 4,
            retryDelay: 3000,
            keepConnectionAlive: false,
        })
    })
}
