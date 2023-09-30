import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientesComponent } from './clientes.component';
import { ListaClientesComponent } from './lista-clientes/lista-clientes.component';
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';

const clientesRoutes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:ClientesComponent,children:[
        {path:"nuevo cliente",component:NuevoClienteComponent},
        {path:"lista clientes",component: ListaClientesComponent},
        {path:"actualizar cliente/:id_client",component:NuevoClienteComponent},
      ]},
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(clientesRoutes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
