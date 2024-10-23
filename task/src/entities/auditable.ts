import {Column, CreateDateColumn, UpdateDateColumn} from 'typeorm'

export abstract class Auditable {
    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @Column({nullable: true, default: null})
    updatedBy: string
}
