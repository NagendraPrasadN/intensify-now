import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { Subscription } from 'rxjs';
import { SplashScreenService } from './shared/_metronic/partials/layout/splash-screen/splash-screen.service';

@Component({
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  title = 'intensify-now';
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private splashScreenService: SplashScreenService,
    private router: Router,
    private swPush: SwPush
  ) {
  	/*
  		// TODO: Firebase & PWA
	  	// https://medium.com/@a.adendrata/push-notifications-with-angular-6-firebase-cloud-massaging-dbfb5fbc0eeb
		// https://medium.com/@arjenbrandenburgh/angulars-pwa-swpush-and-swupdate-15a7e5c154ac
	*/
    // register translations
    
  }

  ngOnInit() {
  const routerSubscription = this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      // clear filtration paginations and others
  
      // hide splash screen
      this.splashScreenService.hide();

      // scroll to top on every route change
      window.scrollTo(0, 0);

      // to display back the body content
      setTimeout(() => {
        document.body.classList.add('page-loaded');
      }, 500);
    }
  });
  this.unsubscribe.push(routerSubscription);
}

ngOnDestroy() {
  this.unsubscribe.forEach((sb) => sb.unsubscribe());
}
}
