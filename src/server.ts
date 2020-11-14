import 'reflect-metadata';
import {App} from './app';
import {Router} from "./routes";
import DIContainer from './di-container';
import {SqliteConnection} from "./infrastructure/Persistence/SqliteConnection";

require('dotenv').config();

const app: App = DIContainer.resolve<App>(App);
const router: Router = DIContainer.resolve<Router>(Router);

app.setPort(parseInt(process.env.APP_PORT || "3000"));
app.listen();

SqliteConnection.createConnection();

router.init(app);