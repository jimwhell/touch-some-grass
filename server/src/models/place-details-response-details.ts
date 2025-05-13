import { PlaceReview } from "./placeReview";

export interface PlaceDetailsResponseDetails {
  html_attributions: string[];
  result: {
    current_opening_hours?: {
      open_now?: boolean;
      weekday_text?: string[];
    };
    editorial_summary?: {
      overview?: string;
    };
    reviews?: PlaceReview[];
    rating?: number;
  };
  status: string;
}
