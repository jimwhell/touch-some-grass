import { PlacePhoto } from "./placePhoto";

export interface PlaceResponseDetail {
  id: string;
  formattedAddress: string;
  googleMapsUri: string;
  displayName: {
    text: string;
  };
  photos: PlacePhoto[];
  primaryType?: string;
}
