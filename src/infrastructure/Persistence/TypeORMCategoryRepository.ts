import {ICategoryRepository} from '../../domain/Repositories/ICategoryRepository';
import {Category} from '../../domain/Entities/Category';
import {injectable} from 'inversify';

@injectable()
export class TypeORMCategoryRepository implements ICategoryRepository{
    public async getCategoriesTree():Promise<Category[]>{
        const rootCategories:Category[] = await Category.find({where:{parent_category:null}});

        for (let rootCategory of rootCategories){
            await rootCategory.getChildCategories();
        }
        return rootCategories;
    }
    public async save(category:Category):Promise<void>{
        await category.save();
    }
    public async getAll():Promise<Category[]>{
        return await Category.find();
    }
}