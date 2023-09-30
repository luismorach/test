import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { NuevaCompraComponent } from './nueva-compra/nueva-compra.component';
import { ComprasComponent } from './compras.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComprasRealizadasComponent } from './compras-realizadas/compras-realizadas.component';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';
import { BuscarComprasComponent } from './buscar-compras/buscar-compras.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { DetallesCompraComponent } from './detalles-compra/detalles-compra.component';


@NgModule({
  declarations: [
    NuevaCompraComponent,
    ComprasComponent,
    ComprasRealizadasComponent,
    BuscarComprasComponent,
    DetallesCompraComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    ReactiveFormsModule,
    TableFilterPipeModule,
    NgxCurrencyModule,
    FormsModule
  ],
  providers:[CurrencyPipe]
})
export class ComprasModule { }
