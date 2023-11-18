import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllSongs, getSongInfo, getYourTopSongs, streamSong } from "../controllers/song";

const songRoute = Router();

songRoute.get("/:id/info", catchAsync(getSongInfo));
songRoute.use("/stream/:file", catchAsync(streamSong));
songRoute.get("/getAll", catchAsync(getAllSongs));
songRoute.get("/getYourTopSongs", catchAsync(getYourTopSongs))

export default songRoute;