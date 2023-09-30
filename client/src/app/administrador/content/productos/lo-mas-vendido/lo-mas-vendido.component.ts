import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { product } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { ProductosService } from '../productos-en-almacen/service/productos.service';

@Component({
  selector: 'app-lo-mas-vendido',
  templateUrl: './lo-mas-vendido.component.html',
  styleUrls: ['./lo-mas-vendido.component.css']
})
export class LoMasVendidoComponent extends DinamicTable {

  tableSearch!: FormGroup;
  data$!:Subscription;
  products: product[] = [];
  title: string[] = [];
  currentData: product[] = [];
  productToDelete!: product;
  
  //Elemento donde se insertaran los numeros 
  //de paginas para la paginacion
  @ViewChild('pagination', { static: false }) override pagination?: ElementRef;
  //Elemento antes del cual se comenzaran a insertar las paginas
  @ViewChild('next', { static: false }) override next?: ElementRef;
  //Elemento que muestra la informacion acerca de la cantidad de paginas mostradas, y filtradas
  @ViewChild('dataTables_info', { static: false }) override info?: ElementRef;
  //Elemento que tiene todas las filas de la tabla de la vista
  @ViewChild('rows', { static: false }) row?: ElementRef;
  //Elemento modal para mostrar alertas
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder,
    public override renderer: Renderer2,
    private comunicatorSvc: ComunicatorComponetsService, 
    private routes: Router,
    private productosSvc: ProductosService) {
    super(renderer)
  }
  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push("fa fa-fire-alt fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
     
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.data$ = this.productosSvc.getProductosMasVendidos().subscribe({
      next: res => { this.currentData = res; this.products = res },
      error: (error: HttpErrorResponse) => {
        this.error(error)
      },
      complete: () => {
        //inserto la cantidad de paginas al DOM segun la cantidad de datos que tengo
        this.createPages(this.tableSearch, this.currentData, this.products)
        //Me suscribo al observer para obtener la lista de usuarios actuales
        //Si se filtran los datos, me devolvera lao usuarios filtradas
        //si no, me devolvera todas los usuarios
        this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
      }
    });

    this.tableSearch = new FormGroup({
      search: new FormControl(),
      numberRows: new FormControl('10')
    });
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  
  ngOnDestroy(){
    this.data$.unsubscribe();
  }

}
