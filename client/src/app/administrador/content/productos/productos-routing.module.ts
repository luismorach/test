import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoProductoComponent } from './nuevo-producto/nuevo-producto.component';
import { ProductosComponent } from './productos.component';
import { ProductosEnAlmacenComponent } from './productos-en-almacen/productos-en-almacen.component';
import { LoMasVendidoComponent } from './lo-mas-vendido/lo-mas-vendido.component';
import { ProductosPorCategoriaComponent } from './productos-por-categoria/productos-por-categoria.component';
import { ProductosPorVencimientoComponent } from './productos-por-vencimiento/productos-por-vencimiento.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {path:'',component:ProductosComponent,children:[
        {path:"nuevo producto",component:NuevoProductoComponent},
        {path:"productos en almacen",component:ProductosEnAlmacenComponent},
        {path:"lo mas vendido",component:LoMasVendidoComponent},
        {path:"productos por categoría",component:ProductosPorCategoriaComponent},
        {path:"productos por vencimiento",component:ProductosPorVencimientoComponent},
        {path:"actualizar producto/:id_product",component:NuevoProductoComponent},
      ]},
     
    ]
  } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
