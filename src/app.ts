import express, {Application} from 'express';
import {injectable} from "inversify";

// Es injeble, se puede (poner) en un DIContainer
@injectable()
export class App {
  public app: Application;
  public port: number;

  constructor() {
    this.app = express();
  }

  public setPort(port: number) {
    this.port = port;
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`Basic social media app (express + ts) listening on port ${this.port}`);
    });
  }

  public getAppInstance() {
    return this.app;
  }
}