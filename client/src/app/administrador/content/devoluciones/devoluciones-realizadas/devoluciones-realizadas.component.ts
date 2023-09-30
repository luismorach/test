import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { repayment, user,alert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { DevolucionesService } from '../service/devoluciones.service';

@Component({
  selector: 'app-devoluciones-realizadas',
  templateUrl: './devoluciones-realizadas.component.html',
  styleUrls: ['./devoluciones-realizadas.component.css']
})
export class DevolucionesRealizadasComponent extends DinamicTable{
  tableSearch!: FormGroup;
  result: any[] = [];
  data$?: Subscription;
  date = new Date()
  users: user[] = [];
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio!: string| undefined;
  currentData: repayment[] = [];
  repayments:repayment[]=[]
  //Elemento donde se insertaran los numeros 
  //de paginas para la paginacion
  @ViewChild('pagination', { static: false }) override pagination?: ElementRef;
  //Elemento antes del cual se comenzaran a insertar las paginas
  @ViewChild('next', { static: false }) override next?: ElementRef;
  @ViewChild('dataTables_info', { static: false }) override info?: ElementRef;

  constructor(private fb: FormBuilder,
    public override renderer: Renderer2,
    private comunicatorSvc: ComunicatorComponetsService,
    private routes: Router,
    private route: ActivatedRoute,
    private devolucionesSvc:DevolucionesService) {
    super(renderer)
  }
  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      title.push("fas fa-people-carry fa-fw");//aañado el icono del titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.route.queryParams.subscribe((params) => {
      this.initialDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
      this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
      this.criterio=undefined
      if (Object.entries(params).length === 2) {
        this.initialDate = new Date(params['initialDate']),
          this.endDate = new Date(params['endDate'])
      } else if (Object.entries(params).length === 1) {
        this.criterio = params['criterio']
      }
      if (Object.entries(params).length === 2 || Object.entries(params).length === 0) {

        this.data$ = this.devolucionesSvc.getRepaymentsBydate(this.initialDate, this.endDate).subscribe({
          next: res => {
            this.aspectosDeDevolucion(res)
          },
          error: (error: HttpErrorResponse) => {
            this.error(error)
          },
          complete: () => {
            this.createPages(this.tableSearch, this.currentData, this.repayments)
            this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
          }
        })
      } else {
        if (Number(Number.isNaN(Number(this.criterio)))) {
          this.criterio=(this.criterio!==undefined)?this.criterio:''
          this.data$ = this.devolucionesSvc.getRepaymentByUser(this.criterio).subscribe({
            next: res => {
              if (res instanceof Array) {
                if (res.length === 0) {
                  this.criterio=(this.criterio!==undefined)?this.criterio:''
                  this.devolucionesSvc.getRepaymentByType(this.criterio).subscribe({
                    next: res => { this.aspectosDeDevolucion(res) },
                    complete: () => {
                      this.createPages(this.tableSearch, this.currentData, this.repayments)
                      this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
                    }
                  }) 
                } else {
                  this.aspectosDeDevolucion(res)
                }
              }
            },
            complete: () => {
              this.createPages(this.tableSearch, this.currentData, this.repayments)
              this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
            }
          })
        } else {
          this.data$ = this.devolucionesSvc.getRepayment(Number(this.criterio)).subscribe({
            next: res => { this.aspectosDeDevolucion(res) },
            complete: () => {
              this.createPages(this.tableSearch, this.currentData, this.repayments)
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
  redirectToDetallesVenta(repayment:repayment) {
    this.routes.navigate(['/ventas/detalles venta'], { queryParams: { id_Repayment: repayment.id_sell } })
  }
  redirectToDetallesCompra(repayment:repayment) {
    this.routes.navigate(['/compras/detalles compra'], { queryParams: { id_buy: repayment.id_buy } })
  }
  aspectosDeDevolucion(res: any[] | alert) {
    if (res instanceof Array) {
      console.log(res)
      let aux: any = res
      this.users = aux
      this.currentData = aux;
      this.repayments = aux
    } else {
      this.changeModal(res)
      this.popUp?.nativeElement.showModal()
    }
  }
  ngOnDestroy(){
    this.data$?.unsubscribe();
  }
}
