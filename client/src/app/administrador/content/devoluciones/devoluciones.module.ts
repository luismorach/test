import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevolucionesRoutingModule } from './devoluciones-routing.module';
import { DevolucionesComponent } from './devoluciones.component';
import { DevolucionesRealizadasComponent } from './devoluciones-realizadas/devoluciones-realizadas.component';
import { BuscarDevolucionesComponent } from './buscar-devoluciones/buscar-devoluciones.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';


@NgModule({
  declarations: [
    DevolucionesComponent,
    DevolucionesRealizadasComponent,
    BuscarDevolucionesComponent
  ],
  imports: [
    CommonModule,
    DevolucionesRoutingModule,
    ReactiveFormsModule,
    TableFilterPipeModule
  ]
})
export class DevolucionesModule { }
