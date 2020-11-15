import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity, ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';

// TODO: add relationships
@Entity()
export class Category extends BaseEntity {
    public getChildCategories = async () => {
        this.child_categories = await Category.find({where:{parent_category: this}});
        for (let category of this.child_categories){
            await category.getChildCategories();
        }
    }
    @PrimaryGeneratedColumn()
    public id:number;

    @Column({unique:true})
    public name:string;

    @ManyToOne(type => Category, category => category.child_categories,)
    parent_category: Category;

    @OneToMany(type => Category, category => category.parent_category,{cascade:true})
    child_categories: Category[];

    @CreateDateColumn({type:"timestamp",nullable:false})
    public created_at: Date;

    @DeleteDateColumn({type:"timestamp", nullable:true, select:false})
    public deleted_at:Date;
}