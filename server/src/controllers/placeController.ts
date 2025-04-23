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
    req: Request<unknown, unknown, SearchQuery, unknown>,
    res: Response
  ) => {
    //extract the query from the request body
    const { query } = req.body;

    if (!query) {
      throw new CustomError("No query found", 404);
    }

    //create a post request using axios and specify the place details to be received in the response in the fieldmask
    const textSearchResult = await axios.post<TextSearchResponse>(
      PLACES_API_URL + ":searchText", //append searchText to API url
      {
        textQuery: query, // query to be passed
        maxResultCount: 8,
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

    if (!textSearchResult) {
      throw new CustomError("Invalid response from Places", 500);
    }

    console.log(textSearchResult.data.places);

    const places: Place[] = textSearchResult.data.places
      .filter(
        (place: PlaceResponseDetail) => place.photos && place.photos.length > 0
      )
      .map((place: PlaceResponseDetail) => {
        const photoName: string = place.photos[0].name;
        return {
          id: place.id,
          formattedAddress: place.formattedAddress,
          googleMapsUri: place.googleMapsUri,
          displayName: place.displayName.text,
          photo: photoName,
        };
      });

    res.status(200).send(places);
  }
);

export const getPlacePhoto = asyncHandler(
  async (
    req: Request<unknown, unknown, unknown, { photoReference?: string }>,
    res: Response
  ) => {
    const { photoReference } = req.query;

    if (!photoReference) {
      throw new CustomError("Photo reference not found", 404);
    }

    const url: string = `https://places.googleapis.com/v1/${photoReference}/media?key=${GOOGLE_PLACES_API_KEY}&maxHeightPx=450&maxWidthPx=450`;

    const photoResponse: AxiosResponse<ArrayBuffer> = await axios.get(url, {
      responseType: "arraybuffer",
      headers: { Accept: "image/jpeg" },
    });

    if (!photoResponse) {
      throw new CustomError("Place photo not found", 404);
    }

    res.status(200).send(photoResponse.data);
  }
);
