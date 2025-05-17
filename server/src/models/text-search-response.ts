import { TextSearchResponseDetail } from "./text-search-response-detail";

export interface TextSearchResponse {
  places: TextSearchResponseDetail[];
  nextPageToken: string;
}
