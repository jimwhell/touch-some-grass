import { Place } from './place';

export interface PaginatedPlaces {
  places: Place[];
  totalPlaces: number;
  next?: {
    page: number;
    limit: number;
  };
  previous?: {
    page: number;
    limit: number;
  };
  nextPageToken: string;
}
