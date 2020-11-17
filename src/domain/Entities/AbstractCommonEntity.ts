import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from "./User";

// Clase creada con la intención de no repetir tanto código. Esta entidad abstracta es común a todas las entidades de
// la aplicación
export abstract class AbstractCommonEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ type: "timestamp", nullable: false })
  public created_at: Date;

  // Columna para el soft delete
  @DeleteDateColumn({ type: "timestamp", nullable: true, select: false })
  public deleted_at: Date;
}