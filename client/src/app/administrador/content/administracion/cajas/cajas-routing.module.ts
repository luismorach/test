import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CajasComponent } from './cajas.component';
import { NuevaCajaComponent } from './nueva-caja/nueva-caja.component';
import { ListaCajasComponent } from './lista-cajas/lista-cajas.component';

const cajasRoutes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:CajasComponent,children:[
        {path:"nueva caja",component:NuevaCajaComponent},
        {path:"lista cajas",component: ListaCajasComponent},
        {path:"actualizar caja/:id_register",component: NuevaCajaComponent}
      ]},
     
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(cajasRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CajasRoutingModule { }
