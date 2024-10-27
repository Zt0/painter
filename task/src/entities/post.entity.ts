import {
    Column,
    Entity,
    Generated,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm'
import {Auditable} from './auditable'
import {Auth} from './auth.entity'

@Entity('post')
export class Post extends Auditable {
    @PrimaryGeneratedColumn()
    id: number

    @Generated('uuid')
    @Column({type: 'varchar', unique: true})
    uuid: string

    @Column({type: 'varchar'})
    authUUID: string

    @Column({type: 'varchar'})
    title: string

    @Column({type: 'varchar', nullable: true})
    description?: string
}
