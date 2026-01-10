import { Router } from "express";
import { AssignmentRoutes } from "../modules/assignment/assignment.route";
import { AuthRoutes } from "../modules/auth/auth.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/',
        router: AuthRoutes
    },
    {
        path: '/',
        router: AssignmentRoutes
    }
];

moduleRoutes.forEach(route => {
    router.use(route.path, route.router);
});

export default router;