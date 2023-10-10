import { Request, Response, Router } from "express";
import bookableAreasController from "./controllers/bookableAreas.controller";
import euupController from "./controllers/euup.controller";

const router = Router();

router.get("/endpoint");

router.get("/areas/ED", euupController.getEuupData);

router.get("/bookableAreas", bookableAreasController.getBookableAreas);
router.patch("/bookableAreas/", bookableAreasController.addBookingToArea);
router.delete("/bookings/:id", bookableAreasController.deleteBookingFromArea);

router.use((req: Request, res: Response) => {
  // 404
  res.status(404).json({ msg: "the requested resource could not be found" });
});

export default { router };
