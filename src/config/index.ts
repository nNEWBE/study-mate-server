import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') })
export default {
    port: process.env.PORT,
    node_env: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mx7zi5i.mongodb.net/studyMate?retryWrites=true&w=majority`,
    jwt_access_secret: process.env.ACCESS_TOKEN_SECRET,
};