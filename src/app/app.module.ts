import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { HeaderComponent } from './pages/header/header.component';
import { OlympicCountryPageComponent } from './pages/olympic-country-page/olympic-country-page.component';

@NgModule({
  declarations: [
    AppComponent, 
    HomeComponent,
    NotFoundComponent,
    HeaderComponent,
    OlympicCountryPageComponent
  ],
  imports: [
    BrowserModule, 
    AppRoutingModule, 
    HttpClientModule,
    CanvasJSAngularChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
