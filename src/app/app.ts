import express, { Express, Response } from "express";
import compression from "compression";
import apiResponse from "../utils/apiResponse.js";
import errorHandler from "../middlewares/errorHandler.js";

const app: Express = express();

// don't identify express
app.disable("x-powered-by");

// parse req body of content application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse req body of content json
app.use(express.json());

// compress res body for response
app.use(compression());

// assign routes
app.all("*", (_, res: Response) => {
  apiResponse.ok(res, { Time: new Date().toISOString() });
});

// respond to unhandled api errors
app.use(errorHandler);

export default app;
