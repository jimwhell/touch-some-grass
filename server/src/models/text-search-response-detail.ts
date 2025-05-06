import { PlacePhoto } from "./placePhoto";

// //represents the details of the data received from the initial Places
// API text search.
export interface TextSearchResponseDetail {
  id: string;
  formattedAddress: string;
  googleMapsUri: string;
  displayName: {
    text: string;
  };
  current_opening_hours: {
    open_now: boolean;
  };
  photos: PlacePhoto[];
  primaryType?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
