import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { SplashScreenModule } from './shared/_metronic/partials/layout/splash-screen/splash-screen.module';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomHttpInterceptor } from './shared/interceptors/custom-http.interceptor';

/**
 * Custom angular notifier options
 */
const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'middle',
      distance: 12
    },
    vertical: {
      position: 'top',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};
 /* NEED UNDERSTANDING
    // https://medium.com/@gerasimov.pk/how-to-reuse-rendered-component-in-angular-2-3-with-routereusestrategy-64628e1ca3eb
    // https://medium.com/@rajeshpillai1996/what-is-routereusestrategy-how-to-cache-components-with-angular-routereusestrategy-82da7790cd2b
    // https://itnext.io/cache-components-with-angular-routereusestrategy-3e4c8b174d5f
    */
    // { provide: RouteReuseStrategy, useClass: CacheRouteReuseStrategy },

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule.forRoot(),
    SplashScreenModule,
    BrowserAnimationsModule,
    NotifierModule.withConfig(customNotifierOptions),
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
