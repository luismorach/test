import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatosDeLaEmpresaComponent } from './datos-de-la-empresa/datos-de-la-empresa.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'datos de la empresa', component: DatosDeLaEmpresaComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionesRoutingModule { }
