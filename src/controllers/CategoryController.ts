import {Request, Response} from "express";
import {injectable} from "inversify";
import {Category} from "../domain/Entities/Category";

@injectable()
export class CategoryController {
    public showForm(req: Request, res: Response) {
    }

    public create(req: Request, res: Response) {
        let category: Category = new Category();
        category.name = req.body.name;

        category.save();

        res.send({message: 'Created', category}).status(201);
    }
}