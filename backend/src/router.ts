import { Router } from "express";
import bookableAreasController from "./controllers/bookableAreas.controller";
import euupService from "./services/euup.service";

const router = Router();

router.get("/areas/ED", euupService.getEuupData);

router.get("/bookableAreas", bookableAreasController.getBookableAreas);
router.patch("/bookableAreas/", bookableAreasController.addBookingToArea);
router.delete("/bookings/:id", bookableAreasController.deleteBookingFromArea);

export default router;
