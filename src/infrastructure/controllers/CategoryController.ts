import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { Category } from "../../domain/Entities/Category";
import { ICategoryRepository } from "../../domain/Repositories/ICategoryRepository";
import TYPES from "../../types";
import { CategoryService } from "../../application/Services/CategoryService";
import {TwingViewRenderService} from '../Services/TwingViewRenderService';

@injectable()
export class CategoryController {
  private categoryRepository: ICategoryRepository;
  private categoryService: CategoryService;
  private viewRenderService: TwingViewRenderService;
  constructor(
    @inject(TYPES.ICategoryRepository) categoryRepository: ICategoryRepository,
    @inject(CategoryService) categoryService: CategoryService,
    @inject(TwingViewRenderService) viewRenderService: TwingViewRenderService
  ) {
    this.categoryRepository = categoryRepository;
    this.categoryService = categoryService;
    this.viewRenderService = viewRenderService;
  }
  public categoryForm = async (request:Request, response:Response)=>{
    const categories: Category[] = await this.categoryRepository.getAll();
    const categoryForm: string = await this.viewRenderService.categoryForm(request.user, categories);
    response.end(categoryForm);
}
  public getAll = async (request: Request, response: Response) => {
    const categories: Category[] = await this.categoryRepository.getCategoriesTree();

    response.json(categories);
  };
  public create = async (request: Request, response: Response) => {
    const payload = request.body;
    const category: Category = await this.categoryService.create(payload.name, payload.parent_category);

    response.send({ message: "Category Created!", category }).status(201);
  };
}
