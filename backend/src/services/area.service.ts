import { euupModel, EuupDocument } from "../models/euup.model";

async function getEuupData(): Promise<EuupDocument | null> {
  try {
    const euup: EuupDocument | null = await euupModel.findOne().exec();
    return euup || null;
  } catch (e) {
    throw e;
  }
}

async function clearAreasCollection() {
  try {
    // Use the .deleteMany() method to remove all documents from the collection
    const result = await euupModel.deleteMany({});

    console.log(
      `Removed ${result.deletedCount} documents from the 'areas' collection.`
    );
  } catch (e) {
    console.error("Error clearing the 'areas' collection:", e);
    throw e;
  }
}

async function addArea(
  name: string,
  minimum_fl: number,
  maximum_fl: number,
  start_datetime: Date,
  end_datetime: Date
) {
  try {
    // Create a new Area document using the Mongoose model
    const area = new euupModel({
      name,
      minimum_fl,
      maximum_fl,
      start_datetime,
      end_datetime,
    });

    // Save the new Area document to the database
    await area.save();
  } catch (error) {
    console.log("Error adding area:", error);
    throw error;
  }
}

export default {
  getEuupData,
  clearAreasCollection,
  addArea,
};
