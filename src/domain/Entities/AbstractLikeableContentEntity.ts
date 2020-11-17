import { AbstractCommonEntity } from "./AbstractCommonEntity";
import { Column, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { User } from "./User";

// esta clase es una base para las entidades Comment y Post, que tienen muchas columnas en común. Así entonces se
// reduce la repetición del código
export abstract class AbstractLikeableContentEntity extends AbstractCommonEntity {
  // un usuario pueded dar likes a MUCHOS contenidos y un contenido puede recibir likes de MUCHOS usuarios
  @ManyToMany(() => User)
  @JoinTable()
  public likers: User[];

  @Column()
  public content: string;

  // El contenido siempre tiene un autor, un creador
  @ManyToOne(() => User, (user) => user.posts)
  public author: User;
}
