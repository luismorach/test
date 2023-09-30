import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { ClientesComponent } from './clientes.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TableFilterPipeModule } from 'src/app/pipes/table-filter.pipe.module';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';


@NgModule({
  declarations: [
    ClientesComponent,
    NuevoClienteComponent,
    ListaClientesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ClientesRoutingModule,
    TableFilterPipeModule
  ],
  exports:[NuevoClienteComponent]
})
export class ClientesModule { }
