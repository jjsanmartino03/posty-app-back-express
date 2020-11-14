import {Request, Response} from 'express';
import {inject, injectable} from "inversify";
import {Example} from "../domain/Entities/Example";
import TYPES from "../types";
import {ExampleRepository} from "../domain/Repositories/ExampleRepository";
import {Category} from "../domain/Entities/Category";

const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('src/views');
let twing = new TwingEnvironment(loader);

@injectable()
export class ExampleController {
    private exampleRepository: ExampleRepository;

    constructor(@inject(TYPES.ExampleRepository) exampleRepository: ExampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    public async getAll(request: Request, response: Response) {

        let examples = await this.exampleRepository.findAll();

        twing.render('examples.twing.html', {examples}).then((output: any) => {
            response.end(output);
        });
    };

    public async showExampleForm(req: Request, res: Response) {
        let categories = await Category.find();
        twing.render('exampleForm.twing.html', {categories}).then((output: any) => {
            res.end(output);
        });
    }

    public async create(request: Request, response: Response) {
        const payload = request.body;

        const example: Example = new Example();
        example.name = payload.name;

        await this.exampleRepository.save(example);

        response.redirect('/examples');
    };
}