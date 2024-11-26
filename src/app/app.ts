import express,{Express} from "express";

// Routes
import homeRoutes from "@/routes/homeRoutes.js";
import testRoutes from "@/routes/testRoutes.js"


const app: Express = express();


// don't identify express
app.disable("x-powered-by");



// parse req body of content application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));


// parse req body of content json
app.use(express.json());


// assign routes
app.use("/", homeRoutes);
app.use("/test", testRoutes);