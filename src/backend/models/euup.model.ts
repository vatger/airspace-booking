import mongoose, { HydratedDocument, Model } from "mongoose";
import { Area, Euup } from "../interfaces/euup.interface";

export type EuupDocument = HydratedDocument<Euup>;
export type AreaDocument = HydratedDocument<Area>;

export const areaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  minimum_fl: { type: Number, default: 0 },
  maximum_fl: { type: Number, default: 660 },
  start_datetime: { type: Date, default: new Date(-1) },
  end_datetime: { type: Date, default: new Date(-1) },
});

export const noticeInfo = new mongoose.Schema({
  type: { type: String, default: "EUUP" },
  valid_wef: { type: Date },
  valid_til: { type: Date },
  released_on: { type: Date },
});

export const euupSchema = new mongoose.Schema({
  notice_info: { type: noticeInfo },
  areas: { type: [areaSchema] },
});

export const euupModel: Model<EuupDocument> = mongoose.model<EuupDocument>(
  "Euup",
  euupSchema,
  "euupData"
);
export const areaModel: Model<AreaDocument> = mongoose.model<AreaDocument>(
  "Area",
  areaSchema
);
