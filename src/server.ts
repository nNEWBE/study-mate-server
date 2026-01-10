/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import config from "./config";

let server: Server;
async function main() {
    try {
        await mongoose.connect(config.database_url as string);
        server = app.listen(config.port, () => {
            console.log(`Server is listening on port ${config.port}`);
        })
    } catch (error) {
        console.log(error);
    }
}
main();

process.on('unhandledRejection', () => {
    console.log(`😈 unhandledRejection is detected , shutting down ...`);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
})

process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
})