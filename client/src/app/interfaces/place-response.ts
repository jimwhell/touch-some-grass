export interface PlaceResponse {
  places: PlaceDetails[];
}

export interface PlaceDetails {
  id: string;
  formattedAddress: string;
  googleMapsUri: string;
  displayName: {
    text: string;
  };
}
