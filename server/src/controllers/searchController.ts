import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
import { SearchQuery } from "../models/search-query";

dotenv.config();

//google places api key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
//google places api url
const PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";

//submit a query to the places api for places, then return the response to the client
export const searchPlace = asyncHandler(async (req: Request, res: Response) => {
  //construct the query according to the searchQuery interface
  const { query }: SearchQuery = req.body;

  //create a post request using axios and specify the place details to be received in the response in the fieldmask
  const response = await axios.post(
    PLACES_API_URL, //places api
    {
      textQuery: query, // query to be passed
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask":
          "places.displayName.text,places.formattedAddress,places.googleMapsUri,places.id,places.photos", //place details to be received
      },
    }
  );

  if (!response) {
    throw new Error("Error in calling Places API");
  }

  res.status(200).json(response.data); //send the data back to the clientt
});
