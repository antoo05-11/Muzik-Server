import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getArtistAlbums, getArtistInfo, getYourArtists } from "../controllers/artist";

const artistRoute = Router();

artistRoute.get("/getYourArtists", catchAsync(getYourArtists));
artistRoute.get("/:id/info", catchAsync(getArtistInfo));
artistRoute.get("/:id/artistAlbums", catchAsync(getArtistAlbums))

export default artistRoute;