import {ExampleRepository} from "../../domain/Repositories/ExampleRepository";
import {Example} from "../../domain/Entities/Example";
import {injectable} from "inversify";

@injectable()
export class TypeORMExampleRepository implements ExampleRepository {
    async findOneById(id: number): Promise<Example | undefined> {
        return await Example.findOne({id});
    }

    async findAll(): Promise<Example[]> {
        return await Example.find();
    }

    async save(example: Example): Promise<void> {
        await example.save();
    }
}