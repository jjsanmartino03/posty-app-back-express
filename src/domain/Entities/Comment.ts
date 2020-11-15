import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {User} from './User';

// TODO: add relationships
@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id:number;

    @Column()
    public content:string;

    @ManyToOne(()=> User, user => user.comments)
    public author: User;

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true})
    public deleted_at:Date;
}