import {Request, Response} from 'express';
import {inject, injectable} from "inversify";
import {Example} from "../../domain/Entities/Example";
import TYPES from "../../types";
import {ExampleRepository} from "../../domain/Repositories/ExampleRepository";
import {Category} from "../../domain/Entities/Category";


@injectable()
export class ExampleController {
    private exampleRepository: ExampleRepository;

    constructor(@inject(TYPES.ExampleRepository) exampleRepository: ExampleRepository) {
        this.exampleRepository = exampleRepository;
    }

    public async getAll(request: Request, response: Response) {

        let examples = await this.exampleRepository.findAll();
    };

    public async showExampleForm(req: Request, res: Response) {
        let categories = await Category.find();
    }

    public async create(request: Request, response: Response) {
        const payload = request.body;

        const example: Example = new Example();
        example.name = payload.name;

        await this.exampleRepository.save(example);

        response.redirect('/examples');
    };
}