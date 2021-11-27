import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {UserResponse} from '../../../api';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent implements OnInit {
  public currentUser: UserResponse;

  deferredPrompt: any;
  showInstallButton = false;

  constructor(private authService: AuthService, private ref: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(currentUser => {
      this.currentUser = currentUser;
      this.ref.markForCheck();
    });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeinstallprompt(e: Event) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showInstallButton = true;
    this.ref.markForCheck();
  }


  addToHomeScreen() {
    this.showInstallButton = false;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice
      .then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.deferredPrompt = null;
      });
  }

  clickLogout() {
    this.authService.logout();
  }

  onNavigation(link: string) {
    location.hash = '#' + link;
  }
}
