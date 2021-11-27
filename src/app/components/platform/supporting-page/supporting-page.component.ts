import {Component, OnInit} from '@angular/core';
import {SubscriptionApiService} from '../../../services/api/subscription-api.service';
import {Observable} from 'rxjs';
import {SubscriptionResponse} from '../../../api';

@Component({
  selector: 'app-supporting-page',
  templateUrl: './supporting-page.component.html',
  styleUrls: ['./supporting-page.component.scss']
})
export class SupportingPageComponent implements OnInit {
  public subscriptions$: Observable<SubscriptionResponse[]>;

  constructor(private subscriptionApiService: SubscriptionApiService) {
  }

  ngOnInit(): void {
    this.subscriptions$ = this.subscriptionApiService.getSubscriptions();
  }

  onCancelClicked(id: number): void {
    this.subscriptionApiService.cancel(id)
      .subscribe(() => this.ngOnInit());
  }
}
