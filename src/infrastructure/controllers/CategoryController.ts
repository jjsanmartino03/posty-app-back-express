import { Request, Response } from "express";
import { injectable } from "inversify";
import { Category } from "../../domain/Entities/Category";

@injectable()
export class CategoryController {
  public getAll = async (request: Request, response: Response) => {
    const rootCategories:Category[] = await Category.find({where:{parent_category:null}});

    for (let rootCategory of rootCategories){
      await rootCategory.getChildCategories();
    }

    response.json(rootCategories);
  };
  public create = async (request: Request, response: Response) => {
    const payload = request.body;
    const category: Category = new Category();
    const parentCategoryId: number | undefined  = payload.parent_category;

    category.name = payload.name;
    if (parentCategoryId){
      category.parent_category = await Category.findOneOrFail(parentCategoryId);
    }

    await category.save();

    response.send({ message: "Category Created!", category }).status(201);
  };
}
