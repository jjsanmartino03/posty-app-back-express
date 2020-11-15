import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, JoinTable, ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import {User} from './User';
import {Post} from './Post';

// TODO: add relationships
@Entity()
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id:number;

    @Column()
    public content:string;

    @ManyToOne(()=> User, user => user.comments)
    public author: User;

    @ManyToOne(()=> Post, post => post.comments)
    public post: Post;

    @ManyToMany(() => User)
    @JoinTable()
    public likers: User[];

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true})
    public deleted_at:Date;
}