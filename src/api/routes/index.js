import {
    Router
} from "express";

import authRoute from "./auth";
import userRoute from "./user";
import songRoute from "./song";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/song", songRoute);

export default router;