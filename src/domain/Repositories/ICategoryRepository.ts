import {Category} from '../Entities/Category';

export interface ICategoryRepository{
    save(category:Category):Promise<void>;
    getCategoriesTree():Promise<Category[]>;
    getAll():Promise<Category[]>
}