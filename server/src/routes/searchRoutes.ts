import { Router } from "express";
import { searchPlace } from "../controllers/searchController";
const router = Router();

//route to conduct a search for places and their details through a query
router.post("/", searchPlace);

export default router;
