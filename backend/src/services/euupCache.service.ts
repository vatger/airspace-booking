import axios from "axios";
import getBookableAreasService from "./bookableAreas.service";
import { areaModel, euupModel } from "../models/euup.model";
import { Area } from "../interfaces/euup.interface";

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
    const bookableAreas = await getBookableAreasService.getBookableAreas();

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

export default { updatedCachedEuupData };
