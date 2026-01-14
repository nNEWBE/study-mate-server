import { Router } from "express";
import { AssignmentRoutes } from "../modules/assignment/assignment.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { SubmissionRoutes } from "../modules/submission/submission.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";
import { ReviewRoutes } from "../modules/review/review.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/',
        router: AuthRoutes
    },
    {
        path: '/assignment',
        router: AssignmentRoutes
    },
    {
        path: '/user',
        router: UserRoutes
    },
    {
        path: '/submission',
        router: SubmissionRoutes
    },
    {
        path: '/category',
        router: CategoryRoutes
    },
    {
        path: '/wishlist',
        router: WishlistRoutes
    },
    {
        path: '/review',
        router: ReviewRoutes
    }
];

moduleRoutes.forEach(route => {
    router.use(route.path, route.router);
});

export default router;