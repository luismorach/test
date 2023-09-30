import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { alert, buy, provider, user } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { ComprasService } from '../service/compras.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuariosService } from '../../administracion/usuarios/service/usuarios.service';
import { ProveedoresService } from '../../administracion/proveedores/service/proveedores.service';

@Component({
  selector: 'app-compras-realizadas',
  templateUrl: './compras-realizadas.component.html',
  styleUrls: ['./compras-realizadas.component.css']
})
export class ComprasRealizadasComponent extends DinamicTable {


  tableSearch!: FormGroup;
  data$!: Subscription;
  buys: buy[] = [];
  users: user[] = []
  providers: provider[] = []
  title: string[] = [];
  currentData: buy[] = [];
  buyToDelete!: buy;
  date = new Date()
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio!: string;
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
    private route: ActivatedRoute,
    private comprasSvc: ComprasService,
    private usersSvc: UsuariosService,
    private providersSvc: ProveedoresService) {
    super(renderer)
  }
  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      title.push("fas fa-file-invoice-dollar fa-fw");//aañado el icono del titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.route.queryParams.subscribe((params) => {
      this.initialDate= new Date(this.date.getFullYear(), this.date.getMonth(), 1)
      this.endDate= new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
      if (Object.entries(params).length === 2) {
        this.initialDate = new Date(params['initialDate']),
          this.endDate = new Date(params['endDate'])
      } else if (Object.entries(params).length === 1) {
        this.criterio = params['criterio']
      }
      if (Object.entries(params).length === 2 || Object.entries(params).length === 0) {

        this.data$ = this.comprasSvc.getBuysBydate(this.initialDate, this.endDate).subscribe({
          next: res => {
            this.buscarAspectosDeCompra(res)
          },
          error: (error: HttpErrorResponse) => {
            this.error(error)
          },
          complete: () => {
            this.createPages(this.tableSearch, this.currentData, this.buys)
            this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
          }
        })
      } else {
        if (Number(Number.isNaN(Number(this.criterio)))) {
          this.data$=this.comprasSvc.getBuyByUser(this.criterio).subscribe({
            next:res=>{
              if(res instanceof Array){
                if(res.length===0){
                 this.comprasSvc.getBuyByProvider(this.criterio).subscribe({
                  next:res=>{this.buscarAspectosDeCompra(res)},
                  complete: () => {
                    this.createPages(this.tableSearch, this.currentData, this.buys)
                    this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
                  }
                 })
                }else{
                  this.buscarAspectosDeCompra(res)
                }
              }
            },
            complete: () => {
              this.createPages(this.tableSearch, this.currentData, this.buys)
              this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
            }
          })
        } else {
          this.data$ = this.comprasSvc.getBuy(Number(this.criterio)).subscribe({
            next: res => { this.buscarAspectosDeCompra(res) },
            complete: () => {
              this.createPages(this.tableSearch, this.currentData, this.buys)
              this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
            }
          })
        }
      }
    })
    this.tableSearch = new FormGroup({
      search: new FormControl(),
      numberRows: new FormControl('10')
    });
  }

  buscarAspectosDeCompra(res: buy[] | alert) {
    if (res instanceof Array) {
      res.forEach((buy: buy) => {
        this.usersSvc.getUser(buy.id_user).subscribe(
          user => {
            if (user instanceof Array)
              this.users.push(user[0])
          })
        this.providersSvc.getProvider(buy.id_provider).subscribe(
          provider => {
            if (provider instanceof Array)
              this.providers.push(provider[0])
          }
        )
      });
      this.currentData = res;
      this.buys = res
    } else {
      this.changeModal(res)
      this.popUp?.nativeElement.showModal()
    }
  }

  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  redirectToDetallesCompra(buy: buy) {
    this.routes.navigate(['/compras/detalles compra'], { queryParams: { id_buy: buy.id_buy } })
  }

  ngOnDestroy() {
    this.data$?.unsubscribe();
  }
}
