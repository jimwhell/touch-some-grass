//represents the full expanded place data retrieved
//both the text search and place detail request

import { Place } from './place';
import { PlaceDetail } from './place-detail';

export interface ExpandedPlace extends Place, PlaceDetail {}
