import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { UsuariosComponent } from './usuarios.component';

const usersRoutes=[
  {
    path: '',
    children: [
      {path:'',component:UsuariosComponent,children:[
        {path:"nuevo usuario",component:NuevoUsuarioComponent},
        {path:"lista usuarios",component: ListaUsuariosComponent},
        {path:"actualizar cuenta",component:NuevoUsuarioComponent},
        {path:"actualizar usuario/:id_user",component:NuevoUsuarioComponent},
      ]},
      
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
