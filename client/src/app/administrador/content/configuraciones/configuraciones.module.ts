import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracionesRoutingModule } from './configuraciones-routing.module';
import { DatosDeLaEmpresaComponent } from './datos-de-la-empresa/datos-de-la-empresa.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DatosDeLaEmpresaComponent,
  ],
  imports: [
    CommonModule,
    ConfiguracionesRoutingModule,
    ReactiveFormsModule
  ]
})
export class ConfiguracionesModule { }
