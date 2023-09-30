import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevolucionesComponent } from './devoluciones.component';
import { DevolucionesRealizadasComponent } from './devoluciones-realizadas/devoluciones-realizadas.component';
import { BuscarDevolucionesComponent } from './buscar-devoluciones/buscar-devoluciones.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: DevolucionesComponent, children: [
          { path: "devoluciones realizadas", component: DevolucionesRealizadasComponent },
          { path: "buscar devoluciones", component: BuscarDevolucionesComponent },
        ]
      },

    ]
  } 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolucionesRoutingModule { }
