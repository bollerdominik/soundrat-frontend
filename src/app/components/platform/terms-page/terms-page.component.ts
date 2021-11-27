import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-terms-page',
  templateUrl: './terms-page.component.html',
  styleUrls: ['./terms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TermsPageComponent {

  constructor() {
  }

}
