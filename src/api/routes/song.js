import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getSongInfo, streamSong } from "../controllers/song";

const songRoute = Router();

songRoute.get("/:id/info", catchAsync(getSongInfo));
songRoute.use("/stream/:file", catchAsync(streamSong));

export default songRoute;