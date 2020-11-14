import {Example} from "../Entities/Example";

export interface ExampleRepository {
    findOneById(id: number): Promise<Example | undefined>;
    findAll(): Promise<Example[]>;
    save(example: Example): Promise<void>;
}