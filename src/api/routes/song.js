import {
    Router
} from "express";


import catchAsync from "../exceptions/catch-async";
import { getSong } from "../controllers/song";

const songRoute = Router();

songRoute.get("/getSong", catchAsync(getSong))

export default songRoute;