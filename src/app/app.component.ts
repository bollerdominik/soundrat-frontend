import {Component} from '@angular/core';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService: AuthService) {
    authService.loadCurrentUser();
  }

  // Fixme there is probably a better way to do this
  //   We do this to trigger a different toolbar/layout on the root page (e.g. the landing page)
  isLandingPage() {
    return window.location.pathname === "/";
  }
}
