/* Entrypoint */
import express from 'express';
import bodyParser from 'body-parser';
import db from './flatfileDB';
import routes from './routes/routes';
import { rmdirSync, existsSync } from "fs";
import { exit } from "process";

if (process.env.MODE === "testing") {
    if (!existsSync(`${process.env.PWD}/package.json`)) {
        console.error("Run tests from source directory")
        exit(1);
    } else {
        const testingDB = `${process.env.PWD}/testingDB`;
        if (existsSync(testingDB)) {
            console.log("Now deleting testingDB");
            rmdirSync(testingDB, {recursive: true});
        }
    }
}

// Create app
const app = express()

// Use bodyParser to accept JSON and URL-encoded strings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add routes to app
const router = express.Router();
routes(router, db);
app.use(router);

export default app;