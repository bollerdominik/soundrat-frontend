import {Component, Input, OnInit} from '@angular/core';
import {CommentResponse} from '../../../api';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  @Input()
  public comments: CommentResponse[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
