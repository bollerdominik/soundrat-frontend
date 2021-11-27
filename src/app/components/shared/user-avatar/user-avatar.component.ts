import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UserResponse} from '../../../api';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserAvatarComponent {

  @Input()
  user: UserResponse;

  @Input()
  size: number;
}


