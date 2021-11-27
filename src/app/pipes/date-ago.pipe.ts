import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {


  transform(value: Date): string {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 60) {
        return 'Just now';
      }

      const intervals = {
        year: 365 * 24 * 60 * 60,
        month: (52 * 7 * 24 * 60 * 60) / 12,
        week: 7 * 24 * 60 * 60,
        day: 24 * 60 * 60,
        hour: 60 * 60,
        minute: 60,
        second: 1
      };
      let counter;
      for (const i of Object.keys(intervals)) {
        // @ts-ignore
        counter = Math.floor(seconds / intervals[i]);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + i + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + i + 's ago'; // plural (2 days ago)
          }
        }
      }
    }
    return '1 day ago';
  }
}
