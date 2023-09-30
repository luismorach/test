import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedoresComponent } from './proveedores.component';
import { ListaProveedoresComponent } from './lista-proveedores/lista-proveedores.component';
import { NuevoProveedorComponent } from './nuevo-proveedor/nuevo-proveedor.component';
import { RouterModule } from '@angular/router';

const proveedoresRoutes=[
  {
    path: '',
    children: [
      {path:'',component:ProveedoresComponent,children:[
        {path:"nuevo proveedor",component:NuevoProveedorComponent},
        {path:"lista proveedores",component: ListaProveedoresComponent},
        {path:"actualizar proveedor/:id_provider",component:NuevoProveedorComponent},
      ]},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(proveedoresRoutes)
  ],exports:[
    RouterModule
  ]
})
export class ProveedoresRoutingModule { }
