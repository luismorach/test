import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComprasComponent } from './compras.component';
import { NuevaCompraComponent } from './nueva-compra/nueva-compra.component';
import { ComprasRealizadasComponent } from './compras-realizadas/compras-realizadas.component';
import { BuscarComprasComponent } from './buscar-compras/buscar-compras.component';
import { DetallesCompraComponent } from './detalles-compra/detalles-compra.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: ComprasComponent, children: [
          { path: "nueva compra", component: NuevaCompraComponent },
          { path: "compras realizadas", component: ComprasRealizadasComponent },
          { path: "buscar compras", component: BuscarComprasComponent },
          { path: "detalles compra", component: DetallesCompraComponent },
        ]
      },

    ]
  } 
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class ComprasRoutingModule { }
