import { request, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import axios, { Axios, AxiosResponse } from "axios";
import dotenv from "dotenv";
import { SearchQuery } from "../models/search-query";
import { CustomError } from "../errors/customError";
import { Place } from "../models/place";
import { PlacePhoto } from "../models/placePhoto";
import { TextSearchResponse } from "../models/text-search-response";
import { TextSearchResponseDetail } from "../models/text-search-response-detail";
import { validationResult, matchedData } from "express-validator";
import { PlaceDetailsResponseDetails } from "../models/place-details-response-details";
import { PlaceDetails } from "../models/place-details";

dotenv.config();

//google places api key
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
//google places api url
const PLACES_API_URL = "https://places.googleapis.com/v1/places";

if (!GOOGLE_PLACES_API_KEY) {
  throw new CustomError("Places API key not found", 500);
}

//submit a query to the places api for places, retrieve minimal place details, then return the response to the client.
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
        maxResultCount: 5, //number of results to be returned
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName.text,places.formattedAddress,places.googleMapsUri,places.id,places.photos,places.primaryType,places.location,places.current_opening_hours", //place details to be received
        },
      }
    );

    if (!textSearchResult) {
      throw new CustomError("Invalid response from Places", 500);
    }

    //only include places with photos
    const filteredPlaces = textSearchResult.data.places.filter(
      (place: TextSearchResponseDetail) =>
        place.photos && place.photos.length > 0
    );

    //return an array of place objects with the operationalStatus property by making an axios call to the Place Details API for each place object
    const places: Place[] = await Promise.all(
      filteredPlaces.map(async (place) => {
        const photoName = place.photos[0].name;
        const placeId = place.id;

        try {
          const { data } = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
              params: {
                fields: "current_opening_hours/open_now",
                place_id: placeId,
                key: GOOGLE_PLACES_API_KEY,
              },
            }
          );

          const openNow = data.result?.current_opening_hours?.open_now ?? null;

          //resolve the promise to the
          return {
            id: place.id,
            formattedAddress: place.formattedAddress,
            googleMapsUri: place.googleMapsUri,
            displayName: place.displayName.text,
            open_now: openNow,
            photo: photoName,
            primaryType: place.primaryType,
            location: place.location,
          };
        } catch (error: any) {
          console.error(
            `Failed to fetch details for place ${placeId}`,
            error.message
          );
          throw new CustomError(error.message, 400);
        }
      })
    );

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

export const getPlaceDetails = asyncHandler(
  async (
    req: Request<{ placeId: string }, unknown, unknown, unknown>,
    res: Response<PlaceDetails>
  ) => {
    const { placeId } = req.params;

    if (!placeId) {
      throw new CustomError("Place ID not found", 400);
    }

    const url: string = `https://maps.googleapis.com/maps/api/place/details/json?fields=current_opening_hours/weekday_text,reviews,editorial_summary/overview&place_id=${placeId}&key=${GOOGLE_PLACES_API_KEY}`;

    //create place details request
    const placeDetailsResult: AxiosResponse<PlaceDetailsResponseDetails> =
      await axios.get<PlaceDetailsResponseDetails>(url);

    if (!placeDetailsResult) {
      throw new CustomError(
        `No place details found for place with a place ID of: ${placeId} `,
        502
      );
    }

    //destructure current_opening_hours and editorial summary from the place Details response
    const { current_opening_hours, editorial_summary, ...rest } =
      placeDetailsResult.data.result;

    //fill the placeDetails object with the remaining fields
    const placeDetails: PlaceDetails = {
      ...rest,
    };

    //conduct type checking and create flattened properties for the new object to be sent to the client, omitting nested properties.
    if (current_opening_hours?.open_now !== undefined) {
      placeDetails.open_now = current_opening_hours.open_now;
    }

    if (Array.isArray(current_opening_hours?.weekday_text)) {
      placeDetails.weekday_text = current_opening_hours.weekday_text;
    }

    if (typeof editorial_summary?.overview === "string") {
      placeDetails.overview = editorial_summary.overview;
    }

    res.status(200).send(placeDetails);
  }
);
