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

@Entity()
export class Category extends AbstractCommonEntity {
  // Este método sirve para traer todas las entidades hijas de esta entidad, y que a su vez las hijas obtengan a sus
  // hijas, creando así un "árbol" de categories
  public getChildCategories = async () => {
    // obtener las categorias hijas de la categoría actual
    this.child_categories = await Category.find({
      where: { parent_category: this },
    });
    for (let category of this.child_categories) {
      await category.getChildCategories();
    }
  };
  // columna unique
  @Column({ unique: true })
  public name: string;
  // Relación autoreferencial, una categoría puede tener una categoría padre, y a su vez puede tener muchas hijas
  @ManyToOne((type) => Category, (category) => category.child_categories)
  parent_category: Category;

  @OneToMany((type) => Category, (category) => category.parent_category,)
  child_categories: Category[];
}
