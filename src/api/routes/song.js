import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllSongs, getSongInfo, getYourTopSongs, streamSong, chartSongs } from "../controllers/song";

const songRoute = Router();

songRoute.get("/:id/info", catchAsync(getSongInfo));
songRoute.use("/stream/:file", catchAsync(streamSong));
songRoute.get("/getAll", catchAsync(getAllSongs));
songRoute.get("/getYourTopSongs", catchAsync(getYourTopSongs))
songRoute.get("/chart", catchAsync(chartSongs));

export default songRoute;