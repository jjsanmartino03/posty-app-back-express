import {BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

// TODO: add relationships
@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id:number;

    @Column({unique:true})
    public name:string;

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true})
    public deleted_at:Date;
}