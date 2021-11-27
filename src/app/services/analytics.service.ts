import {Injectable} from '@angular/core';

declare var posthog: any;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {
    if (location.hostname !== 'localhost') {
      this.loadDynamicScript().then(() => {
          try {
            posthog.init('MmTrf1o0rxqKvmogaI2y35APduBrKfly3udiWCgVpG4', {api_host: 'https://app.posthog.com'});
          } catch (e) {
            console.warn(e);
          }
        }
      );
    }
  }

  public setUser(email: string) {
    try {
      posthog.identify(email);
      posthog.people.set({email});
    } catch (e) {
      console.warn(e);
    }
  }

  loadDynamicScript(): Promise<any> {
    return new Promise((resolve, reject) => {
      const scriptElement = window.document.createElement('script');
      scriptElement.src = 'https://app.posthog.com/static/array.js';

      scriptElement.onload = ev => {
        resolve(ev);
      }

      scriptElement.onerror = () => {
        reject();
      };

      window.document.body.appendChild(scriptElement);
    });
  }
}
