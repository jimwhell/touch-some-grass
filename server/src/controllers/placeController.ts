import { request, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import axios, { Axios, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { SearchQuery } from "../models/search-query";
import { CustomError } from "../errors/customError";
import { Place } from "../models/place";
import { PlacePhoto } from "../models/placePhoto";
import { TextSearchResponse } from "../models/text-search-response";
import { PlaceResponseDetail } from "../models/placeResponseDetail";
import { validationResult, matchedData } from "express-validator";

dotenv.config();

//google places api key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
//google places api url
const PLACES_API_URL = "https://places.googleapis.com/v1/places";

if (!GOOGLE_PLACES_API_KEY) {
  throw new CustomError("Places API key not found", 500);
}

//submit a query to the places api for places, then return the response to the client
export const searchPlaces = asyncHandler(
  async (
    req: Request<
      Record<string, any>,
      unknown,
      SearchQuery,
      Record<string, any>
    >,
    res: Response
  ) => {
    console.log("Request body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const resultArray = result.array();
      const errorMessages = resultArray.map((result) => result.msg);
      res.status(400).send({ error: errorMessages });
      return;
    }

    //extract the query from the request body
    const data: Record<string, SearchQuery> = matchedData(req);
    const query = data.query;
    console.log(`query: ${query}`);

    if (!query) {
      throw new CustomError("No query found", 404);
    }

    //create a post request using axios and specify the place details to be received in the response in the fieldmask
    const textSearchResult = await axios.post<TextSearchResponse>(
      PLACES_API_URL + ":searchText", //append searchText to API url
      {
        textQuery: query, // query to be passed
        maxResultCount: 3, //number of results to be returned
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName.text,places.formattedAddress,places.googleMapsUri,places.id,places.photos,places.primaryType", //place details to be received
        },
      }
    );

    console.log("API response received");

    if (!textSearchResult) {
      throw new CustomError("Invalid response from Places", 500);
    }

    //extract the first photo reference from the photos array of each place object
    const places: Place[] = textSearchResult.data.places
      .filter(
        (place: PlaceResponseDetail) => place.photos && place.photos.length > 0
      ) //only return places with available photos
      .map((place: PlaceResponseDetail) => {
        const photoName: string = place.photos[0].name; //extract the first photo's reference from the photos array
        return {
          id: place.id,
          formattedAddress: place.formattedAddress,
          googleMapsUri: place.googleMapsUri,
          displayName: place.displayName.text,
          photo: photoName,
          primaryType: place.primaryType,
        };
      });

    console.log(`Type of response: ${typeof places}`);

    res.status(200).send(places);
  }
);

//route handler to fetch the place photo file from the Places photos API endpoint
export const getPlacePhoto = asyncHandler(
  async (
    req: Request<
      Record<string, any>,
      unknown,
      unknown,
      { photoReference: string }
    >,
    res: Response
  ) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const resultArray = result.array();
      const errorMessages = resultArray.map((result) => result.msg);
      res.status(400).send({ error: errorMessages });
      return;
    }

    const data: Record<string, any> = matchedData(req);

    const photoReference: string = data.photoReference;
    if (!photoReference) {
      throw new CustomError("Photo reference not found", 404);
    }

    const url: string = `https://places.googleapis.com/v1/${photoReference}/media?key=${GOOGLE_PLACES_API_KEY}&maxHeightPx=130&maxWidthPx=130`; //photos endpoint

    //execute the request for the image file
    const photoResponse: AxiosResponse<ArrayBuffer> = await axios.get(url, {
      responseType: "arraybuffer",
      headers: { Accept: "image/jpeg" }, //only return image files
    });

    if (!photoResponse) {
      throw new CustomError("Place photo not found", 404);
    }

    res.status(200).send(photoResponse.data);
  }
);
