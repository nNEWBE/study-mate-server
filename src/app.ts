import cookieParser from "cookie-parser";
import express, { type Application } from "express"
import cors from "cors";
import notFoundHandler from "./middlewares/notFoundHandler";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./routes";

const app: Application = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://study-mate-project.netlify.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use('/', router);
app.get('/', (req, res) => {
    res.send('Study Mate is running');
})
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;