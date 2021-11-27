import {UserResponse} from '../../api';

export abstract class CanEdit {
  public canEdit: boolean;

  protected checkUserCanEdit(user: UserResponse, currentUser: UserResponse) {
    this.canEdit = user.id === currentUser?.id;
  }
}
