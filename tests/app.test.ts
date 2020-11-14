import {App} from "../src/app";
import "mocha";
import expect from "chai";
import container from "../src/di-container";

describe('Example test suite', () => {
    it('Test App to be defined', () => {
        let app = container.get<App>(App);
        // @ts-ignore
        expect(app).toBeDefined();
    });
});
