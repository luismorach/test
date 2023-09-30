import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { navBar} from './administrador/nav-bar/nav-bar.component';

import { ContentComponent } from './administrador/content/content.component';
import { NavTopComponent } from './administrador/content/nav-top/nav-top.component';

import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from '@angular/common/http';
import { LoginComponent } from './login/login.component'
import { AdministradorComponent } from './administrador/administrador.component';
import { ContentModule } from './administrador/content/content.module';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
