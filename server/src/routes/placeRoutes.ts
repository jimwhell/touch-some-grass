import { Router } from "express";
import { getPlacePhoto, searchPlaces } from "../controllers/placeController";
import { checkSchema } from "express-validator";
import { queryValidationSchema } from "../utils/validationSchemas/querySchema";
import { photoReferenceValidationSchema } from "../utils/validationSchemas/photoReferenceSchema";
const router: Router = Router();

//route to conduct a search for places and their details through a query
router.post("/", checkSchema(queryValidationSchema), searchPlaces);
//proxy route to get place photo
router.get(
  "/photo",
  checkSchema(photoReferenceValidationSchema),
  getPlacePhoto
);

export default router;
