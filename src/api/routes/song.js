import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getSongInfo, streamSong, downloadChunk } from "../controllers/song";

const songRoute = Router();

songRoute.get("/:id/info", catchAsync(getSongInfo));
songRoute.get("/:id/streamsong", catchAsync(streamSong));
songRoute.use("/:id/:file", catchAsync(downloadChunk));


export default songRoute;