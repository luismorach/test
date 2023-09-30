import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresComponent } from './proveedores.component';
import { ProveedoresRoutingModule } from './proveedores-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NuevoProveedorComponent } from './nuevo-proveedor/nuevo-proveedor.component';
import { ListaProveedoresComponent } from './lista-proveedores/lista-proveedores.component';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';



@NgModule({
  declarations: [
    ProveedoresComponent,
    NuevoProveedorComponent,
    ListaProveedoresComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProveedoresRoutingModule,
    TableFilterPipeModule
  ]
})
export class ProveedoresModule { }
