export interface Place {
  id: string;
  formattedAddress: string;
  googleMapsUri: string;
  displayName: string;
  photo: string;
  primaryType?: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
