import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {ContextTypeRequest, PostResponse} from '../../../api';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsComponent {

  @Input()
  posts: PostResponse[];

  @Input()
  context: ContextTypeRequest = 'ALL_POSTS_OF_ARTIST';


  constructor() {
  }
}
