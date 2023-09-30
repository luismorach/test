import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

const appRoutes: Routes = [
   {path:'',component:LoginComponent}, 
   {path:"",loadChildren: () => import
  ('./administrador/administrador.module').then(m => m.AdministradorModule)},  
]


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
