import App from './App';
import "reflect-metadata";
import 'dotenv/config';

import database from './db/Database';
import AuthController from './auth/AuthController';
import MeasurementController from './measurement/MeasurementController';

const port = parseInt(process.env.PORT as string) || 3000;



database.connect()
  .then(() => {
    const app = new App([
      new AuthController(),
      new MeasurementController()
    ], port);

    app.listen();
});
