import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllPlaylists, getAllSongs } from "../controllers/playlist";

const playlistRoute = Router();

playlistRoute.get("/get", catchAsync(getAllPlaylists));
playlistRoute.get("/get/:id", catchAsync(getAllSongs));

export default playlistRoute;