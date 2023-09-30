import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path:'',
    children:[
      {path:'dashboard',component:DashboardComponent},
      {path:'administracion',
      loadChildren: () => import
      ('./administracion/cajas/cajas.module').then(m => m.CajasModule)},
      {path:'administracion',
      loadChildren: () => import
      ('./administracion/categorias/categorias.module').then(m => m.CategoriasModule)},
      {path:'administracion',
      loadChildren: () => import
      ('./administracion/proveedores/proveedores.module').then(m => m.ProveedoresModule)},
      {path:'administracion',
      loadChildren: () => import
      ('./administracion/usuarios/usuarios.module').then(m => m.UsuariosModule)},
      {path:'administracion',
      loadChildren: () => import
      ('./administracion/clientes/clientes.module').then(m => m.ClientesModule)},
      {path:'productos',
      loadChildren: () => import
      ('./productos/productos.module').then(m => m.ProductosModule)},
      {path:'compras',
      loadChildren: () => import
      ('./compras/compras.module').then(m => m.ComprasModule)},
      {path:'ventas',
      loadChildren: () => import
      ('./ventas/ventas.module').then(m => m.VentasModule)},
      {path:'devoluciones',
      loadChildren: () => import
      ('./devoluciones/devoluciones.module').then(m => m.DevolucionesModule)},
      {path:'kardex',
      loadChildren: () => import
      ('./kardex/kardex.module').then(m => m.KardexModule)},
      {path:'reportes',
      loadChildren: () => import
      ('./reportes/reportes.module').then(m => m.ReportesModule)},
      {path:'configuraciones',
      loadChildren: () => import
      ('./configuraciones/configuraciones.module').then(m => m.ConfiguracionesModule)},

    ]
  }
];
      
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }
