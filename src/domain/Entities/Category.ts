import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import {AbstractCommonEntity} from './AbstractCommonEntity';

// TODO: add relationships
@Entity()
export class Category extends AbstractCommonEntity {

  public getChildCategories = async () => {
    this.child_categories = await Category.find({
      where: { parent_category: this },
    });
    for (let category of this.child_categories) {
      await category.getChildCategories();
    }
  };

  @Column({ unique: true })
  public name: string;

  @ManyToOne((type) => Category, (category) => category.child_categories)
  parent_category: Category;

  @OneToMany((type) => Category, (category) => category.parent_category, {
    cascade: true,
  })
  child_categories: Category[];
}
