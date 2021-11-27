import {Component, OnInit} from '@angular/core';
import {PostResponse} from "../../../api";
import {StreamApiService} from "../../../services/api/stream-api.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
  selector: 'app-personal-stream-page',
  templateUrl: './personal-stream-page.component.html',
  styleUrls: ['./personal-stream-page.component.scss']
})
export class PersonalStreamPageComponent implements OnInit {
  posts: PostResponse[];
  private page: number = 0;
  private selectedTabIndex: number = 0;

  constructor(private streamApiService: StreamApiService) {
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  onLoadMore() {
    this.page++;
    this.loadPosts(true);
  }

  loadPosts(merge: boolean = false) {
    if (this.selectedTabIndex === 0) {
      this.streamApiService.getFollowings(this.page).subscribe(value => {
        this.addOrMergePosts(merge, value);
      });
    } else {
      this.streamApiService.getLikes(this.page).subscribe(value => {
        this.addOrMergePosts(merge, value);
      });
    }
  }

  private addOrMergePosts(merge: boolean, value: PostResponse[]) {
    if (merge) {
      this.posts = this.posts.concat(value);
    } else {
      this.posts = value;
    }
  }

  onTabChange($event: MatTabChangeEvent) {
    this.page = 0;
    this.selectedTabIndex = $event.index;
    this.loadPosts();
  }
}
