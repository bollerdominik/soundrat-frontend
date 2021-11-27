import {Component, OnInit} from '@angular/core';
import {FeedbackApiService} from '../../services/api/feedback-api.service';
import {Title} from '@angular/platform-browser';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: [
    './landing-page.component.scss',
    './landing-page.component_2.scss',
    './landing-variables.scss'
  ],
})
export class LandingPageComponent implements OnInit {

  isVisibleNav = false;

  DICTIONARY = {
    common: {
      upload: 'Upload',
      signIn: 'Sign In',
      getStarted: 'Discover artists',
      listenNow: 'Listen now',
      terms: 'Terms and Conditions',
    },
    sections: {
      promoTitle_1: 'Support',
      promoTitle_2: 'your favorite',
      promoTitle_3: 'artists',
      promoText: 'SoundRat is a platform for independent artists. ' +
        'Artists can share their music for free.' +
        ' Fans can support their favorite artists directly.',
      forArtist: 'For Artists',
      forFans: 'For Fans',
      newestArtists: 'Newest Artists',
      feedback: 'Feedback',
    },
    statuses: {
      onFire: 'On Fire',
      risingStar: 'Rising Star',
    },
  };

  nav = [
    {
      label: this.DICTIONARY.sections.forArtist,
      link: 'forArtist',
    },
    {
      label: this.DICTIONARY.sections.forFans,
      link: 'forFans',
    },
    {
      label: this.DICTIONARY.sections.feedback,
      link: 'feedback',
    },
  ];

  forArtistArr = [
    {
      title: 'Share Music',
      text: 'Upload and share your music for free. Let anyone listen to your music without needing an account.',
      icon: 'i_free-shares',
    },
    {
      title: 'Get Paid',
      text: 'Receive payments from your loyal fans. We made it as easy as possible for artists to get paid.',
      icon: 'i_rewards',
    },
    {
      title: 'Engage',
      text: 'Engage with your fanbase through chats and live streams (coming soon).',
      icon: 'i_engageble',
    },
  ];

  forFAnsArr = [
    {
      title: 'Listen Free',
      text: 'Listen to your favorite music for free on any device.',
      icon: 'i_listen-free',
    },
    {
      title: 'No Ads',
      text: 'Enjoy uninterrupted music streaming with no advertisements.',
      icon: 'i_no-ads',
    },
    {
      title: 'Support',
      text: 'Support your favorite artist and stand out as a loyal fan.',
      icon: 'i_engageble_1',
    },
  ];

  cards = [
    {
      img: 'ntol.jpg',
      // status: this.DICTIONARY.statuses.onFire,
      // statusIcon: 'i_fire',
      title: 'NtoL',
      route: 'ntol'
    },
    {
      img: 'card_2.png',
      title: 'ajakswavy',
      route: 'ajakswavy'
    },
    {
      img: 'card_3a.png',
      title: 'Benny Universe',
      route: 'benny-universe'
    },
    {
      img: 'heartblake.jpg',
      title: 'heartblake',
      route: 'heartblake'
    },
    {
      img: 'lildead.jpg',
      title: 'Lil Dead Star',
      route: 'lil-dead-star'
    }
  ];
  sendFeedback: boolean;


  constructor(private feedbackApiService: FeedbackApiService,
              private titleService: Title) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('SoundRat - Support your favorite artists!');
  }

  goTo(link: string) {
    location.hash = '#' + link;
  }

  onSendFeedbackClicked(name: string, email: string, message: string) {
    this.feedbackApiService.create({
      email, message, name
    }).subscribe(() => this.sendFeedback = true);
  }
}
