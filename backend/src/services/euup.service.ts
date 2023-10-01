import axios from "axios";
import { euupModel, EuupDocument, areaModel } from "../models/euup.model";
import bookableAreaService from "./bookableArea.service";

async function getEuupData(): Promise<EuupDocument | null> {
  try {
    const euup: EuupDocument | null = await euupModel.findOne().exec();
    return euup || null;
  } catch (e) {
    throw e;
  }
}

async function clearEuupData() {
  try {
    // Use the .deleteMany() method to remove all documents from the collection
    const result = await euupModel.deleteMany({});

    console.log(
      `Removed ${result.deletedCount} documents from the 'euup' collection.`
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
    // Find the single object in the collection
    const euupDataObject = await euupModel.findOne();

    if (!euupDataObject) {
      console.error("The EUUP data object could not be found");
    }

    // Create a new area with the provided data
    const newArea = {
      name,
      minimum_fl,
      maximum_fl,
      start_datetime,
      end_datetime,
    };

    // Push the new area into the areas array of the existing object
    euupDataObject?.areas.push(newArea);

    // Save the updated object back to the database
    await euupDataObject?.save();
  } catch (error) {
    console.error("Error adding area to the EUUP data object:", error);
  }
}

async function updatedCachedEuupData() {
  try {
    const data = (await axios.get("https://lara.vatsim.pt/api/areas/ED/")).data;

    const euupData = new euupModel({
      notice_info: {
        type: data.notice_info.type,
        valid_wef: data.notice_info.valid_wef,
        valid_til: data.notice_info.valid_til,
        released_on: data.notice_info.released_on,
      },
      areas: [],
    });

    // Fetch the bookableAreas collection from the database
    const bookableAreas = await bookableAreaService.getBookableAreas();

    for (const areaData of data.areas) {
      // check if the area is bookable, only cache non-bookable areas
      const isBookableArea = bookableAreas.find(
        (bookableArea) => bookableArea.name === areaData.name
      );

      if (!isBookableArea) {
        // Create a new Area document using the Mongoose model
        const area = new areaModel({
          name: areaData.name,
          minimum_fl: areaData.minimum_fl,
          maximum_fl: areaData.maximum_fl,
          start_datetime: areaData.start_datetime,
          end_datetime: areaData.end_datetime,
        });

        // Push the newly created area into the euupData's areas array
        euupData.areas.push(area);
      }
    }
    // Save the updated euupData with the areas
    await euupData.save();
    console.log("Updated cached EUUP data");
  } catch (e) {
    console.log("Error getting EUUP data or updating areas", e);
    throw e;
  }
}

export default {
  getEuupData,
  updatedCachedEuupData,
  clearEuupData,
  addArea,
};
