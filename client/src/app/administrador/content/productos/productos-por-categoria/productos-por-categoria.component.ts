import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { category, product, productByCategory } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CategoriasService } from '../../administracion/categorias/service/categorias.service';
import { ProductosService } from '../productos-en-almacen/service/productos.service';

@Component({
  selector: 'app-productos-por-categoria',
  templateUrl: './productos-por-categoria.component.html',
  styleUrls: ['./productos-por-categoria.component.css']
})
export class ProductosPorCategoriaComponent {
  categories: category[] = [];
  currentCategory!:category
  productByCategory: productByCategory[] = []
  currentProducts!:product[]
  selected:boolean=false

  constructor(private routes: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private categoriesSvc: CategoriasService,
    private productsSvc: ProductosService) { }

  ngOnInit() {
    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push("fas fa-box fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array

      this.comunicatorSvc.setTitleComponent(title);
    });
    this.categoriesSvc.getCategories().subscribe({
      next: categories => { this.categories = categories },
      complete: () => {
        this.categories.forEach((category: category) => {
          this.productsSvc.getProductoByCategory(category.id_category).subscribe(
            products => {
              if (products instanceof Array) {
                this.productByCategory.push({ category, products })
              } else {
                products = []
                this.productByCategory.push({ category, products })
              }
            }
          )
        });
      }
    });
  }

  selectedCategory(category:category,products:product[]) {
    this.selected=true
    this.currentProducts=products
    this.currentCategory=category
  }
}
