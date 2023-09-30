import { Router } from "express";
import areasController from "./controllers/areas.controller";
import bookingController from "./controllers/booking.controller";
import bookableAreasController from "./controllers/bookableAreas.controller";

const router = Router();

router.get("/bookings", bookingController.getBookings);
router.post("/bookings", bookingController.addBooking);
router.delete("/bookings/:id", bookingController.deleteBooking);

router.get("/bookableAreas", bookableAreasController.getBookedAreas);

export default router;
