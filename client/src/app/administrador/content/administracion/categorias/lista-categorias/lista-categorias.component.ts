import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { category } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { CategoriasService } from '../service/categorias.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lista-categorias',
  templateUrl: './lista-categorias.component.html',
  styleUrls: ['./lista-categorias.component.css']
})
export class ListaCategoriasComponent extends DinamicTable {
  tableSearch!: FormGroup;
  result: any[] = [];
  data!: Subscription;
  comunicatorData!: Subscription;
  categories: category[] = [];
  title: string[] = [];
  currentData: category[] = [];
  categoryToDelete!: category;

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
    private categoriasSvc: CategoriasService) {
    super(renderer)
  }
  ngOnInit() {
    setTimeout(() => {
      //Obtengo la ruta actual y la transformo para obtener el titulo del componente
      let ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      //Añado el icono del titulo al array
      this.title.push("fas fa-clipboard-list fa-fw");
      //Añado el titulo al array
      this.title.push(decodeURI(ruta).toUpperCase());
      //Añado el array al observer para que otros componentes se enteren del contenido
      this.comunicatorSvc.setTitleComponent(this.title);
    });

    //Me suscribo al observer para obtener toda la lista de cajas en mi base de datos
    this.data = this.categoriasSvc.getCategories().subscribe({
      next: res => { this.currentData = res; this.categories = res },
      error: (error: HttpErrorResponse) => {
        this.error(error)
      },
      complete: () => {
        //inserto la cantidad de paginas al DOM segun la cantidad de datos que tengo
        this.createPages(this.tableSearch, this.currentData, this.categories)
        //Me suscribo al observer para obtener la lista de cajas actuales
        //Si se filtran los datos, me devolvera las cajas filtradas
        //si no, me devolvera todas las cajas
        this.comunicatorData=this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
      }
    });
    this.tableSearch = new FormGroup({
      search: new FormControl(),
      numberRows: new FormControl('10'),
      campSearch: new FormControl('name')
    });
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }

  redirectToUpdate(data: category) {
    this.routes.navigate(['/administracion/actualizar categoría/' + data.id_category])
  }

  delete(data: category) {
    this.popUp?.nativeElement.close()
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {

      //elimino la caja de mi base de datos
      this.categoriasSvc.deleteCategory(data.id_category).subscribe({
        next: res => {
          this.changeModal(res);
          this.popUp?.nativeElement.showModal();
        },
        error: (error: HttpErrorResponse) => {
          this.changeModal(this.comunicatorSvc.errorServer(error))
          this.popUp?.nativeElement.showModal()
        },
        complete: () => {
          //Obtengo el indice del elemento que voy a eliminar
          let index = this.categories.indexOf(data)
          //elimino el elemento de mi lista de cajas totales
          this.categories.splice(index, 1)
          //elimino el elemento de mi lista de cajas actuales
          index = this.currentData.indexOf(data)
          this.currentData.splice(index, 1)
          //elimino la fila de mi tabla en la vista
          let values = this.getValuesToPipe(this.tableSearch)
          let rowToDelete = index - (values.numberRows * values.indexCurrentPage)
          this.renderer.removeChild(this.row?.nativeElement, this.row?.nativeElement.children[rowToDelete])
          //renderizo la paginacion una vez mas, para que se actualice
          this.createPages(this.tableSearch, this.currentData, this.categories)
        }
      })

    }
  }
  ngOnDestroy() {
    this.data.unsubscribe();
    this.comunicatorData.unsubscribe();
  }
}
