import axios from "axios";

//Set up base URL for WCF Service
const apiUrl = `http://localhost:58398/Service1.svc`;

//Get Products API CALL
export const getProducts = async () => {
  //Make a get request to the GetProducts endpoint ofthe WCF Service
  try {
    const response = await axios.get(`${apiUrl}/GetProducts`);
    console.log("API Response Data:", response.data); // Check if the data is as expected
    //Return response data ,which contains the list of products
    return response.data;
  } catch (error) {
    //Log errors that occur during api call
    console.error(`Error fetching the products:`, error);

    // Rethrow the error to be handled by the calling function if needed
    throw error;
  }
};
