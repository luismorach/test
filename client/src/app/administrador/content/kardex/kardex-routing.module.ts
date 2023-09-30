import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KardexComponent } from './kardex.component';
import { KardexGeneralComponent } from './kardex-general/kardex-general.component';
import { BuscarKardexComponent } from './buscar-kardex/buscar-kardex.component';
import { DetallesKardexComponent } from './detalles-kardex/detalles-kardex/detalles-kardex.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '', component: KardexComponent, children: [
          { path: "kardex general", component: KardexGeneralComponent },
          { path: "detalles kardex", component: DetallesKardexComponent },
          { path: "buscar kardex", component: BuscarKardexComponent },
        ]
      },

    ]
  } 
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KardexRoutingModule { }
