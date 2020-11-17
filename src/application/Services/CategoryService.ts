import {Category} from '../../domain/Entities/Category';
import {ICategoryRepository} from '../../domain/Repositories/ICategoryRepository';
import {inject, injectable} from 'inversify';
import TYPES from '../../types';

@injectable()
export class CategoryService{
    private categoryRepository: ICategoryRepository;
    constructor(@inject(TYPES.ICategoryRepository)categoryRepository: ICategoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    public async create(name:string, parentCategoryId:number|undefined):Promise<Category>{
        const category : Category = new Category();
        category.name = name;
        if (parentCategoryId){
            category.parent_category = await Category.findOneOrFail(parentCategoryId);
        }
        await this.categoryRepository.save(category);
        return category;
    }
}