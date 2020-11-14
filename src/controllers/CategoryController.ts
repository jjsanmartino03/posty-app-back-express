import {Request, Response} from "express";
import {injectable} from "inversify";
import {Category} from "../domain/Entities/Category";

const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('src/views');
let twing = new TwingEnvironment(loader);

@injectable()
export class CategoryController {
    public showForm(req: Request, res: Response) {
        twing.render('categoryForm.twing.html').then((output: any) => {
            res.end(output);
        });
    }

    public create(req: Request, res: Response) {
        let category: Category = new Category();
        category.name = req.body.name;

        category.save();

        res.send({message: 'Created', category}).status(201);
    }
}