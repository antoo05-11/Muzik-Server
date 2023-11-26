import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllPlaylists, getAllSongs, getTopPlaylist } from "../controllers/playlist";

const playlistRoute = Router();

playlistRoute.get("/get", catchAsync(getAllPlaylists));
playlistRoute.get("/:id/info", catchAsync(getAllSongs));
playlistRoute.get("/getTopPlaylists", catchAsync(getTopPlaylist));

export default playlistRoute;