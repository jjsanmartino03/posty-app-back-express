import { AbstractCommonEntity } from "./AbstractCommonEntity";
import { Column, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { User } from "./User";

export abstract class AbstractLikeableContentEntity extends AbstractCommonEntity {
  @ManyToMany(() => User)
  @JoinTable()
  public likers: User[];

  @Column()
  public content: string;

  @ManyToOne(() => User, (user) => user.posts)
  public author: User;
}
