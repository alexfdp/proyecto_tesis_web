import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MenuComponent } from './modules/menu/menu.component';
import { SharedModule } from './shared/shared/shared.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { authGuard } from './guards/auth.guard';
import { DatePipe } from '@angular/common';
import { AuthenticationInterceptor } from './shared/services/interceptor';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    SharedModule,
    HttpClientModule
  ],
  providers: [
    authGuard,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
