import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {IExample} from "../../interfaces/example.interface";
import {Category} from "./Category";

@Entity()
export class Example extends BaseEntity implements IExample {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string = '';

    @ManyToOne(() => Example)
    category: Category;
}