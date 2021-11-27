import {Component, Input, OnInit} from '@angular/core';
import {PostResponse, UserResponse} from '../../../api';
import {DiscoverApiService} from '../../../services/api/discover-api.service';
import {Observable} from 'rxjs';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-discover-page',
  templateUrl: './discover-page.component.html',
  styleUrls: ['./discover-page.component.scss']
})
export class DiscoverPageComponent implements OnInit {
  artists$: Observable<UserResponse[]>;
  posts: PostResponse[];
  private page = 0;

  @Input()
  miniMode = false;

  constructor(private discoverApiService: DiscoverApiService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.discoverApiService.getPosts(this.page).subscribe(value => {
      if (this.miniMode) {
        this.posts = value.filter(post => post.track).slice(0, 6);
      } else {
        this.posts = value;
      }
    });
    this.artists$ = this.discoverApiService.getTrendingUsers();

    if (!this.miniMode) {
      this.titleService.setTitle('Discover Music - SoundRat');
    }
  }

  onLoadMore() {
    ++this.page;
    this.discoverApiService.getPosts(this.page)
      .subscribe(value => value.forEach(element => this.posts.push(element)));
  }
}
