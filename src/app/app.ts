import express, { Express } from "express";
import compression from "compression";
import errorHandler from "../middlewares/errorHandler.js";
import routes from "../routes/routes.js";
import apiResponse from "../middlewares/apiResponose/apiResponse.js";

const app: Express = express();

// don't identify express
app.disable("x-powered-by");

// parse req body of content application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse req body of content json
app.use(express.json());

// compress res body for response
app.use(compression());

// adds custom api response methods to express response object
app.use(apiResponse);

// assign routes
app.use("/", routes);

// respond to unhandled api errors
app.use(errorHandler);

export default app;
