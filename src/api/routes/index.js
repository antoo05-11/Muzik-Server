import {
    Router
} from "express";

import authRoute from "./auth";
import userRoute from "./user";
import songRoute from "./song";
import playlistRoute from "./playlist";
import albumRoute from "./album";
import artistRoute from "./artist";

const router = Router();

router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/song", songRoute);
router.use("/playlist", playlistRoute);
router.use("/album", albumRoute);
router.use("/artist", artistRoute);


export default router;