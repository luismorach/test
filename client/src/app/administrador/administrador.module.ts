import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { AdministradorComponent } from './administrador.component';
import { navBar } from './nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { ContentModule } from './content/content.module';
import { NavTopComponent } from './content/nav-top/nav-top.component';


@NgModule({
  declarations: [
    AdministradorComponent,
    navBar,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    HttpClientModule,
    ContentModule
  ]
})
export class AdministradorModule { }
