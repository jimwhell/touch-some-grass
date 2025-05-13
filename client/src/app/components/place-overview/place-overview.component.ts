import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaceService } from '../../services/place.service';
import { ExpandedPlace } from '../../interfaces/expanded-place';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-place-overview',
  imports: [CommonModule],
  templateUrl: './place-overview.component.html',
  styleUrl: './place-overview.component.css',
})
export class PlaceOverviewComponent implements OnInit {
  //represents the selectedPlace derived from the selectedPlace observable in PlaceService
  selectedPlace$!: Observable<ExpandedPlace | null>;
  selectedPlace!: ExpandedPlace; //declare a second property that stores the emitted value from the observable for use in internal logic
  isDropdownClicked: boolean = false;
  operationStatus!: string;

  constructor(private placeService: PlaceService) {}

  //assign the selected place observable to
  // this component's selectedPlace observable property
  ngOnInit(): void {
    const selectedPlaceFromService: Observable<ExpandedPlace | null> =
      this.placeService.selectedPlace$;
    this.selectedPlace$ = selectedPlaceFromService;

    //subscribe to observable and assign emitted value to selectedPlace property
    this.selectedPlace$.subscribe({
      next: (selectedPlace) => {
        if (selectedPlace !== null) {
          console.log('Value of observable: ', selectedPlace);
          this.selectedPlace = selectedPlace;
          this.getOperationStatus(selectedPlace);
        }
      },
      error: (err) => {
        console.error('Expanded place not found: ', err);
      },
    });
  }

  toggleDropdown(): void {
    this.isDropdownClicked === true
      ? (this.isDropdownClicked = false)
      : (this.isDropdownClicked = true);
  }

  //method to assign place operation status
  getOperationStatus(place: ExpandedPlace): void {
    this.operationStatus = ''; //reset operation status value upon selecting new place

    //Consists of the current period based on the current week of the day that corresponds to the
    //day contained inside place weekday_text property
    const possibleCurrentPeriod: string | undefined = this.getCurrentPeriod(
      place.weekday_text
    );

    if (!possibleCurrentPeriod) {
      console.error('Current period not found');
      return;
    }

    //Perform a check if today's schedule is open for 24 hours
    const isOpen24Hours: boolean = this.check24HourStatus(
      possibleCurrentPeriod
    );

    //if the possibleCurrentPeriod's schedule is 24 hours, assign operation status to 'Open 24 hours'
    if (isOpen24Hours) {
      this.operationStatus = 'Open 24 hours';
      return;
    }

    // if place is not open for 24 hours,
    // extract opening sched and closing sched from
    // the possibleCurrentPeriod string in this format: (10:00 AM)
    const { openingSched, closingSched } = this.getPeriodTimes(
      possibleCurrentPeriod
    );

    //Utilize the place object's open_now property to perform a check if
    //place is currently open
    if (place.open_now) {
      //if place is open, format the place's opening sched to a dateTime object for comparison
      const formattedOpeningSched: DateTime = this.toDateTime(openingSched);
      const currentTime: DateTime = DateTime.now(); //create a dateTime object consisting of the current date and time
      //perform a conditional check if currentTime is earlier than the
      // possibleCurrentPeriod's opening sched while the place is still open, meaning
      //that it is an instance of the previous's period schedule extending past midnight
      if (currentTime < formattedOpeningSched) {
        //to handle these cases, find the index of the possibleCurrentperiod from the weekday_text array property
        //and adjust the current period to the previous period
        const possiblePeriodIndex: number = this.findCurrentPeriodIndex(
          possibleCurrentPeriod
        );
        let adjustedCurrentPeriod: string; //assign a variable to hold the value of the adjusted period
        if (possiblePeriodIndex === 0) {
          //if the derived index of the current period is equal to 0 (Sunday),
          //access the element in the sixth index of the array since 0-1 returns -1
          adjustedCurrentPeriod = this.selectedPlace.weekday_text[6];
          return;
        }
        // if index != 0, rollback to the previous extending period by subtracting the possiblePeriodIndex
        //by 1 and use the difference to access the element in the array
        adjustedCurrentPeriod =
          this.selectedPlace.weekday_text[possiblePeriodIndex - 1];

        //extract the opening sched and closing sched of the adjustedPeriod
        const { openingSched, closingSched } = this.getPeriodTimes(
          adjustedCurrentPeriod
        );

        //assign operation status to the closing schedule
        this.operationStatus = `Closes at ${closingSched}`;
        return;
      }
      //if place is open now and the currentTime is not earlier than the possiblePeriod's openingSched,
      //assign operation status with the closing sched of possiblePeriod.
      this.operationStatus = ` Closes at ${closingSched}`;
      return;
    }

    // if place is not open, assign extracted
    // opening sched from possiblePeriod to operation status
    this.operationStatus = `Opens at ${openingSched}`;
  }

  // Returns the current day's period string from an array of weekday texts
  getCurrentPeriod(weekdayText: string[]): string | undefined {
    const currentDate: Date = new Date();

    // Get the full weekday name for the current date (e.g., "Monday")
    const weekdayName: string = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
    }).format(currentDate);

    // Find the first period that includes the current weekday name
    const currentPeriod: string | undefined = weekdayText.find((period) =>
      period.includes(weekdayName)
    );

    // If not found, log an error and return undefined
    if (!currentPeriod) {
      console.error('Current period not found');
      return;
    }

    return currentPeriod;
  }

  // Extracts and returns the opening and closing times from a formatted period string
  getPeriodTimes(currentPeriod: string) {
    const normalized = currentPeriod
      .replace(/\u202F|\u00A0|\u2009/g, ' ') // Replace non-breaking or narrow spaces with regular spaces
      .replace(/[–—]/g, '-') // Replace en/em dashes with a standard hyphen
      .replace(/\s+/g, ' '); // Normalize multiple spaces to a single space

    console.log('Normalized:', normalized);

    // Extract time portion after the colon (e.g., "Monday: 9:00 AM - 5:00 PM")
    const timePart = normalized.split(': ')[1];
    console.log('timePart:', timePart);

    // Split the time into opening and closing times
    const [openingSched, closingSched] = timePart.split(' - ');
    console.log(openingSched);
    console.log(closingSched);

    return { openingSched, closingSched };
  }

  // Checks whether the current period includes "24", indicating 24-hour operation
  check24HourStatus(currentPeriod: string) {
    return currentPeriod.includes('24');
  }

  // Converts a time string (e.g., "9:00 AM") to a Luxon DateTime object
  toDateTime(timeStr: string): DateTime {
    const dt: DateTime<true> | DateTime<false> = DateTime.fromFormat(
      timeStr,
      'h:mm a'
    );

    // Throw error if the format is invalid
    if (!dt.isValid) {
      throw new Error(`Invalid time format: ${timeStr}`);
    }

    return dt;
  }

  // Finds and returns the index of the current period in the full weekday text array
  findCurrentPeriodIndex(currentPeriod: string): number {
    const periodIndex: number = this.selectedPlace.weekday_text.findIndex(
      (period) => period === currentPeriod
    );
    return periodIndex;
  }
}
