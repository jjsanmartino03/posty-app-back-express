import 'reflect-metadata';
import {App} from './app';
import {Router} from "./routes";
import DIContainer from './di-container';

// todo: enviar mails con twing
require('dotenv').config();
// crear una instancia de aplicación
const app: App = DIContainer.resolve<App>(App);
// crear una instancia de Router, con sus determinadas dependencias
const router: Router = DIContainer.resolve<Router>(Router);

app.setPort(parseInt(process.env.APP_PORT || "3333"));
app.listen();
// Inicializar el router, que setea las rutas, la conexión con la BD y los middlewares
router.init(app);