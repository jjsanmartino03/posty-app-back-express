import {BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn} from 'typeorm';

// TODO: add relationships
@Entity()
export default class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id:number;

    @Column()
    public title:string;

    @Column()
    public content:string;

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true})
    public deleted_at:Date;
}