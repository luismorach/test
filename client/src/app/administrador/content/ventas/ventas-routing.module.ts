import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VentasComponent } from './ventas.component';
import { NuevaVentaComponent } from './nueva-venta/nueva-venta.component';
import { VentasRealizadasComponent } from './ventas-realizadas/ventas-realizadas.component';
import { BuscarVentasComponent } from './buscar-ventas/buscar-ventas.component';
import { DetallesVentaComponent } from './detalles-venta/detalles-venta.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: VentasComponent, children: [
          { path: "nueva venta", component: NuevaVentaComponent },
          { path: "ventas realizadas", component: VentasRealizadasComponent },
          { path: "buscar ventas", component: BuscarVentasComponent },
          { path: "detalles venta", component: DetallesVentaComponent },
        ]
      },

    ]
  } 
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
