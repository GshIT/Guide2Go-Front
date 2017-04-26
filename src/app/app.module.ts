import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { Login } from '../pages/login/login';
import { ReferedPage} from '../pages/refered/refered';
import { ZonesPage } from '../pages/zones/zones';
import { MainPage } from '../pages/main/main';
import { RecommendPage } from '../pages/recommend/recommend';
import { UserZonesPage } from '../pages/user-zones/user-zones';
import { MapaPage } from '../pages/mapa/mapa';
import { GuideLoginPage } from '../pages/guide-login/guide-login';
import { RegisterPage } from '../pages/register/register';

@NgModule({
  declarations: [
    MyApp,
    Login,
    ReferedPage,
    ZonesPage,
    MainPage,
    RecommendPage,
    UserZonesPage,
    MapaPage,
    GuideLoginPage,
    RegisterPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    ReferedPage,
    ZonesPage,
    MainPage,
    RecommendPage,
    UserZonesPage,
    MapaPage,
    GuideLoginPage,
    RegisterPage
  ],
  providers: [{
    provide: ErrorHandler,
    useClass: IonicErrorHandler
  }]
})
export class AppModule {}
