import { Router } from "express";
import bookableAreasController from "./controllers/bookableAreas.controller";
import euupController from "./controllers/euup.controller";

const router = Router();

router.get("/areas/ED", euupController.getEuupData);

router.get("/bookableAreas", bookableAreasController.getBookableAreas);
router.patch("/bookableAreas/", bookableAreasController.addBookingToArea);
router.delete("/bookings/:id", bookableAreasController.deleteBookingFromArea);

export default router;
