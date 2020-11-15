import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";
import { Category } from "./Category";

// TODO: add relationships
@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public title: string;

  @Column()
  public content: string;

  @ManyToOne(() => User, (user) => user.posts)
  public author: User;

  @OneToMany(() => Comment, (comment) => comment.post, {cascade:true})
  public comments: Comment[];

  @ManyToMany(() => Category, {cascade:true})
  @JoinTable()
  public categories: Category[];

  @ManyToMany(() => User,)
  @JoinTable()
  public likers: User[];

  @CreateDateColumn({ type: "timestamp", nullable: false })
  public created_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  public deleted_at: Date;
}
