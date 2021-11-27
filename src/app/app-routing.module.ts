import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
  {
    path: 'upload',
    loadChildren: () => import('./components/platform/upload-page/upload.module').then(m => m.UploadModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./components/platform/login-page/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/platform/register-page/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'supporting',
    loadChildren: () => import('./components/platform/supporting-page/supporting.module').then(m => m.SupportingModule)
  },
  {
    path: 'verify',
    loadChildren: () => import('./components/platform/verify-page/verify.module').then(m => m.VerifyModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./components/platform/terms-page/terms-page.module').then(m => m.TermsPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/platform/dashboard-page/dashboard-page.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'discover',
    loadChildren: () => import('./components/platform/discover-page/discover.module').then(m => m.DiscoverModule)
  },
  {
    path: 'stream',
    loadChildren: () => import('./components/platform/personal-stream-page/personal-stream.module').then(m => m.PersonalStreamModule)
  },
  {
    path: ':userRoute',
    loadChildren: () => import('./components/platform/platform.module').then(m => m.PlatformModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
