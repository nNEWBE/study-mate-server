import cookieParser from "cookie-parser";
import express, { type Application } from "express"
import cors from "cors";
import notFoundHandler from "./middlewares/notFoundHandler";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./routes";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

const app: Application = express();

// Security: Set HTTP headers
app.use(helmet());

// Security: Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Security: CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin ||
            origin.startsWith('http://localhost') ||
            origin.includes('.netlify.app') ||
            origin.includes('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parsers with size limits
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Security: Data Sanitization against NoSQL Query Injection
app.use(mongoSanitize());

// Security: Prevent HTTP Parameter Pollution
app.use(hpp());

app.use('/api/v1', router);
app.get('/', (req, res) => {
    res.send('Study Mate is running');
})
app.use(globalErrorHandler);
app.use(notFoundHandler);

export default app;