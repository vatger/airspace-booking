import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";

import bodyparser from 'body-parser';
import cookieParser from 'cookie-parser';

import getConfig from "./config";
import router from "./router";
import mongoose from "mongoose";
import cron from "node-cron";

import bookableAreaService from "./services/bookableArea.service";
import euupService from "./services/euup.service";

const { port } = getConfig();

const app = express();

app.use(morgan("combined"));
app.use(express.json());

app.use(bodyparser.json());
app.use(cookieParser());

app.use("/api/v1", router.router);

const frontendRoot = "/opt/dist/frontend";
app.use(express.static(frontendRoot));
app.use((req, res) => res.sendFile(`${frontendRoot}/index.html`));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req: Request, res: Response, next: NextFunction) => {
  console.log("err", err);

  // 500
  res.status(500).json({ msg: "an error occurred" });
});

await mongoose.connect(getConfig().mongoUri);

const updateData = async () => {
  try {
    bookableAreaService.removeOldBookings();
    await euupService.clearEuupData();
    await euupService.updatedCachedEuupData();
    await bookableAreaService.addBookedAreasToEuupData();
  } catch (error) {
    console.log("Error while getting lara data", error);
  }
};

// run tasks on startup
updateData();

// Schedule tasks
cron.schedule("*/30 * * * *", async () => {
  updateData();
});

app.listen(port, () => {
  console.log(`application is listening on port ${port}`);
});
