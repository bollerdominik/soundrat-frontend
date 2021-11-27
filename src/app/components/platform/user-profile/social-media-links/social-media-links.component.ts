import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SocialMediaResponse} from '../../../../api';

@Component({
  selector: 'app-social-media-links',
  templateUrl: './social-media-links.component.html',
  styleUrls: ['./social-media-links.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SocialMediaLinksComponent implements OnInit {

  @Input()
  public socialMediaLinks: SocialMediaResponse[];

  constructor() { }

  ngOnInit(): void {
  }

}
