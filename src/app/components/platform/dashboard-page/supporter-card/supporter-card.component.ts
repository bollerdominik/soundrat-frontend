import {Component, Input, OnInit} from '@angular/core';
import {MessageResponse, SupporterResponse} from '../../../../api';
import {DashboardApiService} from '../../../../services/api/dashboard-api.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-supporter-card',
  templateUrl: './supporter-card.component.html',
  styleUrls: ['./supporter-card.component.scss']
})
export class SupporterCardComponent implements OnInit {

  @Input()
  subscription: SupporterResponse;

  showMessages = false;
  messages: MessageResponse[];

  constructor(private dashboardApiService: DashboardApiService) {
  }

  ngOnInit(): void {
  }

  onMessagesClicked() {
    this.dashboardApiService.getMessages(this.subscription.id)
      .subscribe(value => {
        this.messages = value;
        this.showMessages = !this.showMessages;
      });
  }

  onSubmitMessageClicked(textAreaElement: HTMLTextAreaElement) {
    this.dashboardApiService.createMessage(this.subscription.id, {
      message: textAreaElement.value
    })
      .pipe(switchMap(() => this.dashboardApiService.getMessages(this.subscription.id)))
      .subscribe(value => this.messages = value);

    textAreaElement.value = '';
  }
}
