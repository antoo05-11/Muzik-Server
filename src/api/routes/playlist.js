import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllPlaylists, getAllSongs, getTopPlaylist, addSongToPlaylist, createPlaylist } from "../controllers/playlist";
import { verifyToken } from "../middlewares/verify";

const playlistRoute = Router();

playlistRoute.get("/get", verifyToken, catchAsync(getAllPlaylists));
playlistRoute.get("/:id/info", catchAsync(getAllSongs));
playlistRoute.get("/getTopPlaylists", catchAsync(getTopPlaylist));
playlistRoute.post("/:id/add", catchAsync(addSongToPlaylist));
playlistRoute.post("/create", verifyToken, catchAsync(createPlaylist));

export default playlistRoute;