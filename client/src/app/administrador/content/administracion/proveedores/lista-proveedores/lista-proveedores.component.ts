import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription} from 'rxjs';
import { provider } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { ProveedoresService } from '../service/proveedores.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-lista-proveedores',
  templateUrl: './lista-proveedores.component.html',
  styleUrls: ['./lista-proveedores.component.css']
})
export class ListaProveedoresComponent extends DinamicTable {

  tableSearch!: FormGroup;
  data!: Subscription
  comunicatorData!:Subscription
  providers: provider[] = [];
  title: string[] = [];
  currentData: provider[] = [];
  providerToDelete!: provider;

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
    private providersSvc: ProveedoresService) {
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


    this.tableSearch = new FormGroup({
      search: new FormControl(),
      numberRows: new FormControl('10'),
      campSearch:new FormControl('name_provider')
    });
    //Me suscribo al observer para obtener toda la lista de proveedores en mi base de datos
    this.data = this.providersSvc.getProviders().subscribe({
      next: res => { this.currentData = res; this.providers = res },
      error: (error: HttpErrorResponse) => {
        this.error(error)
      },
      complete: () => {
        //inserto la cantidad de paginas al DOM segun la cantidad de datos que tengo
        this.createPages(this.tableSearch, this.currentData, this.providers)
        //Me suscribo al observer para obtener la lista de proveedores actuales
        //Si se filtran los datos, me devolvera las proveedores filtrados
        //si no, me devolvera todos los proveedores
        this.comunicatorData=this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
      }
    });
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }

  redirectToUpdate(data: provider) {
    this.routes.navigate(['/administracion/actualizar proveedor/' + data.id_provider])
  }
  delete(data: provider) {
    this.popUp?.nativeElement.close()

    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      //Elimino el proveedor de mi base de datos
      this.providersSvc.deleteProvider(data.id_provider).subscribe({
        next: res => {
          console.log(res)
          this.changeModal(res);
          this.popUp?.nativeElement.showModal();
        },
        error: (error: HttpErrorResponse) => {
          this.changeModal(this.comunicatorSvc.errorServer(error))
          this.popUp?.nativeElement.showModal()
        },
        complete: () => {
          //Obtengo el indice del elemento que voy a eliminar
          let index = this.providers.indexOf(data)
          //Elimino el elemento de mi lista de proveedores totales
          this.providers.splice(index, 1)
          //elimino el elemento de mi lista de proveedores actuales
          index = this.currentData.indexOf(data)
          this.currentData.splice(index, 1)
          //Elimino la fila de mi tabla en la vista
          let values = this.getValuesToPipe(this.tableSearch)
          let rowToDelete = index - (values.numberRows * values.indexCurrentPage)
          this.renderer.removeChild(this.row?.nativeElement, this.row?.nativeElement.children[rowToDelete])
          //Renderizo la paginacion una vez mas, para que se actualice
          this.createPages(this.tableSearch, this.currentData, this.providers)
        }
      })

    }
  }

  ngOnDestroy() {
    this.data.unsubscribe();
    this.comunicatorData.unsubscribe()
  }
}
