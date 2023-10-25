import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getAllAlbums, getAllSongs } from "../controllers/album";

const albumRoute = Router();

albumRoute.get("/get", catchAsync(getAllAlbums));
albumRoute.get("/get/:id", catchAsync(getAllSongs));

export default albumRoute;