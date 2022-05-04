/* Entrypoint */
import express from 'express';
import bodyParser from 'body-parser';
import { acronymRoutes } from './routes/routes';

// Create app
const app = express()

// Use bodyParser to accept JSON and URL-encoded strings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add routes to app
const router = express.Router();
acronymRoutes(router);
app.use(router);

export default app;