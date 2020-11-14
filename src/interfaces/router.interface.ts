import {App} from "../app";

export interface IRouter {
  /**
   * Mandatory initializer. App cannot be injected because the router shouldn't have
   * an own App instance.
   * @param app
   */
  init(app: App): void;
}