import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReportesComponent } from './reportes.component';
import { ReporteDeVentaComponent } from './reporte-de-venta/reporte-de-venta.component';
import { ReporteDeInventarioComponent } from './reporte-de-inventario/reporte-de-inventario.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ReportesComponent,
    ReporteDeVentaComponent,
    ReporteDeInventarioComponent
  ],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ReactiveFormsModule
  ]
})
export class ReportesModule { }
