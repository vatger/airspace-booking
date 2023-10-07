import express from "express";
import mongoose from "mongoose";
import bodyparser from "body-parser";
import cron from "node-cron";

import config from "./config";
import router from "./router";
import euupService from "./services/euup.service";
import bookableAreaService from "./services/bookableArea.service";

(async () => {
  if (!config().mongoUri) {
    throw new Error("MONGO_URI has to be set!");
  }

  await mongoose.connect(config().mongoUri);

  // Run tasks on startup
  (async () => {
    try {
      await bookableAreaService.removeOldBookings();
      await euupService.clearEuupData();
      await euupService.updatedCachedEuupData();
      await bookableAreaService.addBookedAreasToEuupData();
    } catch (error) {
      console.log("Error while getting lara data", error);
    }
  })();

  // Schedule tasks
  cron.schedule("*/30 * * * *", async () => {
    try {
      await bookableAreaService.removeOldBookings();
      await euupService.clearEuupData();
      await euupService.updatedCachedEuupData();
      await bookableAreaService.addBookedAreasToEuupData();
    } catch (error) {
      console.log("Error while getting lara data", error);
    }
  });

  const app = express();

  app.use(bodyparser.json());

  app.use("/api/v1", router);

  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  );

  const port = config().port;
  app.listen(port, () => {
    console.log("listening on port", port);
  });
})();
