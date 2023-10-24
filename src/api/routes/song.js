import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getSongInfo, streamSong } from "../controllers/song";

const songRoute = Router();

songRoute.get("/:id/info", catchAsync(getSongInfo));
songRoute.get("/:id/stream", catchAsync(streamSong));

export default songRoute;