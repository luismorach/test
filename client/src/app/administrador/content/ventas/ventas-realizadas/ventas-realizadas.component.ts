import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { VentasService } from '../service/ventas.service';
import { HttpErrorResponse } from '@angular/common/http';
import { alert, sell, client, user } from 'src/app/interfaces/interfaces';
@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css']
})
export class VentasRealizadasComponent extends DinamicTable {

  tableSearch!: FormGroup;
  result: any[] = [];
  data$?: Subscription;
  date = new Date()
  user: user[] = [];
  clients: client[] = []
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio!: string;
  currentData: sell[] = [];
  sells: sell[] = []
  //Elemento donde se insertaran los numeros 
  //de paginas para la paginacion
  @ViewChild('pagination', { static: false }) override pagination?: ElementRef;
  //Elemento antes del cual se comenzaran a insertar las paginas
  @ViewChild('next', { static: false }) override next?: ElementRef;
  @ViewChild('dataTables_info', { static: false }) override info?: ElementRef;
  //Elemento modal para mostrar alertas
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder,
    public override renderer: Renderer2,
    private comunicatorSvc: ComunicatorComponetsService,
    private routes: Router,
    private ventasSvc: VentasService,
    private route: ActivatedRoute,) {
    super(renderer)
   
  }
  ngOnInit() {


    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      title.push("fas fa-coins fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.route.queryParams.subscribe((params) => {
      this.initialDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
      this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)

      if (Object.entries(params).length === 2) {
        this.initialDate = new Date(params['initialDate']),
          this.endDate = new Date(params['endDate'])
      } else if (Object.entries(params).length === 1) {
        this.criterio = params['criterio']
      }
      if (Object.entries(params).length === 2 || Object.entries(params).length === 0) {

        this.data$ = this.ventasSvc.getSellsBydate(this.initialDate, this.endDate).subscribe({
          next: res => {
            this.buscarAspectosDeVenta(res)
          },
          error: (error: HttpErrorResponse) => {
            this.error(error)
          },
          complete: () => {
            this.createPages(this.tableSearch, this.currentData, this.sells)
            this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
          }
        })
      } else {
        if (Number(Number.isNaN(Number(this.criterio)))) {
          this.data$ = this.ventasSvc.getSellByUser(this.criterio).subscribe({
            next: res => {
              if (res instanceof Array) {
                if (res.length === 0) {
                  this.ventasSvc.getSellByClient(this.criterio).subscribe({
                    next: res => { this.buscarAspectosDeVenta(res) },
                    complete: () => {
                      this.createPages(this.tableSearch, this.currentData, this.sells)
                      this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
                    }
                  })
                } else {
                  this.buscarAspectosDeVenta(res)
                }
              }
            },
            complete: () => {
              this.createPages(this.tableSearch, this.currentData, this.sells)
              this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
            }
          })
        } else {
          this.data$ = this.ventasSvc.getSell(Number(this.criterio)).subscribe({
            next: res => { this.buscarAspectosDeVenta(res) },
            complete: () => {
              this.createPages(this.tableSearch, this.currentData, this.sells)
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
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  redirectToDetallesVenta(sell: sell) {
    this.routes.navigate(['/ventas/detalles venta'], { queryParams: { id_sell: sell.id_sell } })
  }
  buscarAspectosDeVenta(res: any[] | alert) {
    if (res instanceof Array) {
      console.log(res)
      let aux: any = res
      this.user = aux
      this.clients = aux
      this.currentData = aux;
      this.sells = aux
    } else {
      this.changeModal(res)
      this.popUp?.nativeElement.showModal()
    }
  }

  ngOnDestroy() {
    this.data$?.unsubscribe();
  }

}
