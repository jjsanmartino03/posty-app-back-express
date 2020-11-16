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

export abstract class AbstractCommonEntity extends BaseEntity{
  @PrimaryGeneratedColumn()
  public id: number;

  @CreateDateColumn({ type: "timestamp", nullable: false })
  public created_at: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true, select: false })
  public deleted_at: Date;
}