import { environment } from './../environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from  '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { RegisterPipe } from './pages/register.pipe';
import { NgxGaugeModule } from 'ngx-gauge';
import Amplify from 'aws-amplify';
import { GraphQLModule } from './graphql.module';
import { HighchartsChartModule } from 'highcharts-angular';
import { Network } from '@ionic-native/network/ngx';
/**configure AWS_amplify */
Amplify.configure({
  Auth:
      {
        mandatorySignId:true,
        region:environment.Region,
        userPoolId:environment.COGNITO_POOL.UserPoolId,
        userPoolWebClientId:environment.COGNITO_POOL.ClientId
      }
})
@NgModule({
  declarations: [AppComponent, RegisterPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,NgxGaugeModule,HighchartsChartModule,HttpClientModule, GraphQLModule],
  providers: [
    StatusBar,
    SplashScreen,HttpClientModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Network
  ],
  bootstrap: [AppComponent]

})
export class AppModule {}
