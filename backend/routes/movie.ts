import { Router } from "express";
import { movieByIdService } from "../controller/movieByID";

const router = Router();

router.get('/:id', movieByIdService);

export default router;