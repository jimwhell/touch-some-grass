export interface Place {
  id: string;
  formattedAddress: string;
  googleMapsUri: string;
  displayName: string;
  open_now?: boolean;
  photo: string;
  primaryType?: string;
  location: {
    latitude: number;
    longitude: number;
  };
  total_acc_rating?: number;
}
