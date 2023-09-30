import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias.component';
import { NuevaCategoriaComponent } from './nueva-categoria/nueva-categoria.component';
import { ListaCategoriasComponent } from './lista-categorias/lista-categorias.component';

const categoriasRoutes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:CategoriasComponent,children:[
        {path:"nueva categoría",component:NuevaCategoriaComponent},
        {path:"lista categorías",component: ListaCategoriasComponent},
        {path:"actualizar categoría/:id_category",component:NuevaCategoriaComponent},
      ]},
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(categoriasRoutes)
  ],
  exports:[
    RouterModule
  ]
})

export class CategoriasRoutingModule { }
