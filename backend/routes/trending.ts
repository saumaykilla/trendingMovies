import {Router} from "express"
import { trendingMovieService } from "../controller/trendingMovieService";

const router = Router();

router.get("/:time_window",trendingMovieService);

export default router;
