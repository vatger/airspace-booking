import axios from "axios";

async function getBookableAreas() {
  try {
    const response = await axios.get("/api/v1/bookableAreas");
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default {
  getBookableAreas,
};
