import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductosRoutingModule } from './productos-routing.module';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductosComponent } from './productos.component';
import { ProductosEnAlmacenComponent } from './productos-en-almacen/productos-en-almacen.component';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';
import { RouterModule } from '@angular/router';
import { LoMasVendidoComponent } from './lo-mas-vendido/lo-mas-vendido.component';
import { ProductosPorCategoriaComponent } from './productos-por-categoria/productos-por-categoria.component';
import { ProductosPorVencimientoComponent } from './productos-por-vencimiento/productos-por-vencimiento.component';


@NgModule({
  declarations: [
    NuevoProductoComponent,
    ProductosComponent,
    ProductosEnAlmacenComponent,
    LoMasVendidoComponent,
    ProductosPorCategoriaComponent,
    ProductosPorVencimientoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProductosRoutingModule,
    TableFilterPipeModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ProductosModule { }
