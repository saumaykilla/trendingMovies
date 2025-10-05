import { Router } from "express";
import { movieByIdService } from "../controller/movieByID";

const router = Router();

router.get('/:id', movieByIdService);

module.exports = router;