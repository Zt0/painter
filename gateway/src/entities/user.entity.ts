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

@Entity('user')
export class User extends Auditable {
    @PrimaryGeneratedColumn()
    id: number

    @Generated('uuid')
    @Column({type: 'varchar', unique: true})
    uuid: string

    @Column({type: 'int', unique: true})
    authId: number

    @Column({type: 'date', nullable: true})
    dateOfBirth?: Date

    @Column({type: 'varchar', nullable: true})
    address?: string

    @Column({type: 'varchar', nullable: true})
    description?: string

    @Column({type: 'varchar'})
    firstName: string

    @Column({type: 'varchar'})
    lastName: string

    @Column({type: 'varchar', nullable: true})
    imageURL?: string

    @Column({type: 'varchar', nullable: true})
    phone?: string

    @OneToOne(() => Auth, (auth) => auth.id)
    @JoinColumn({name: 'authId'})
    auth: Auth
}
