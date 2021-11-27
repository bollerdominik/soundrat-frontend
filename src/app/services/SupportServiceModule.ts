import {NgModule} from '@angular/core';


/**
 * Fixes circular dependency on lazy loading see
 * https://github.com/angular/angular-cli/issues/10170#issuecomment-433882049
 */
@NgModule({
  declarations: [],
  imports: [],
  providers: []
})
export class SupportServiceModule {
}
