import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllAlbums, getAllSongs, getRecentAlbums } from "../controllers/album";

const albumRoute = Router();

albumRoute.get("/getAll", catchAsync(getAllAlbums));
albumRoute.get("/:id/info", catchAsync(getAllSongs));
albumRoute.get("/getRecentAlbums", catchAsync(getRecentAlbums))

export default albumRoute;