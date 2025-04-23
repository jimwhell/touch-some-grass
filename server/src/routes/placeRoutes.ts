import { Router } from "express";
import { getPlacePhoto, searchPlaces } from "../controllers/placeController";
const router: Router = Router();

//route to conduct a search for places and their details through a query
router.post("/", searchPlaces);
//proxy route to get place photo
router.get("/photo", getPlacePhoto);

export default router;
