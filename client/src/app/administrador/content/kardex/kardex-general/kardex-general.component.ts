import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { KardexService } from '../service/kardex.service';
import { coin, kardex, product, alert } from 'src/app/interfaces/interfaces';
import { CoinsService } from '../../configuraciones/service/coins.service';
import { HttpErrorResponse } from '@angular/common/http';
import { VentasService } from '../../ventas/service/ventas.service';

@Component({
  selector: 'app-kardex-general',
  templateUrl: './kardex-general.component.html',
  styleUrls: ['./kardex-general.component.css']
})
export class KardexGeneralComponent extends DinamicTable {
  tableSearch!: FormGroup;
  result: any[] = [];
  data$?: Subscription;
  kardex: kardex[] = []
  currentData: kardex[] = []
  products: product[] = []
  mainCoin!: coin
  date = new Date()
  initialDate: Date = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
  endDate: Date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
  criterio!: number | undefined;
  //Elemento donde se insertaran los numeros 
  //de paginas para la paginacion
  @ViewChild('pagination', { static: false }) override pagination?: ElementRef;
  //Elemento antes del cual se comenzaran a insertar las paginas
  @ViewChild('next', { static: false }) override next?: ElementRef;
  @ViewChild('dataTables_info', { static: false }) override info?: ElementRef;

  constructor(private fb: FormBuilder,
    public override renderer: Renderer2,
    public comunicatorSvc: ComunicatorComponetsService,
    private routes: Router,
    private kardexSvc: KardexService,
    private ventasSvc: VentasService,
    private coinsSvc: CoinsService,
    private route: ActivatedRoute,) {
    super(renderer)
  }
  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      title.push("fas fa-pallet fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.route.queryParams.subscribe((params) => {
      this.initialDate = new Date(this.date.getFullYear(), this.date.getMonth(), 1)
      this.endDate = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0)
      this.criterio = undefined
      if (Object.entries(params).length === 2) {
        this.initialDate = new Date(params['initialDate']),
          this.endDate = new Date(params['endDate'])
      } else if (Object.entries(params).length === 1) {
        this.criterio = params['criterio']
      }
      if (Object.entries(params).length === 2 || Object.entries(params).length === 0) {
        this.kardexSvc.getKardexByDate(this.initialDate, this.endDate).subscribe({
          next: res => {
            this.aspectosDeKardex(res)
          },
          error: (error: HttpErrorResponse) => {
            this.error(error)
          },
          complete: () => {
            this.createPages(this.tableSearch, this.currentData, this.kardex)
            this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
          }
        })
      } else {
        this.criterio = params['barcode']
        this.kardexSvc.getKardexByProduct(params['barcode']).subscribe({
          next: res => {
            console.log(res)
            this.aspectosDeKardex(res)
          },
          error: (error: HttpErrorResponse) => {
            this.error(error)
          },
          complete: () => {
            this.createPages(this.tableSearch, this.currentData, this.kardex)
            this.comunicatorSvc.getData().subscribe(res => this.currentData = res)
          }
        })
      }
    })

    this.coinsSvc.getMainCoin().subscribe(res => {
      if (res instanceof Array)
        this.mainCoin = res[0]
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
  aspectosDeKardex(res: any[] | alert) {
    let aux: any = res
    this.kardex = aux;
    this.currentData = aux
    this.products = aux
  }
  redirectToDetallesKardex(kardex: kardex) {
    this.routes.navigate(['/kardex/detalles kardex'],
      { queryParams: { id: kardex.id_operation, id_product: kardex.id_product, type: kardex.type } })
  }
  calcularTotalVenta(kardex: kardex) {
    let price_with_discount=0
    /* this.ventasSvc.getSell(kardex.id_operation).subscribe(res => {
      if (res instanceof Array) {
        console.log('venta')
        console.log(res) */
       /*  let aux: any = res
        this.ventasSvc.getProductSell(aux[0].id_sell, aux[0].id_product).subscribe(response => {
          if (response instanceof Array) {
            price_with_discount = Number(((response[0].sell_price - Number((response[0].sell_price *
              response[0].discount_product).toFixed(2)))).toFixed(2))
            let montoImponible = Number((aux[0].impuest * price_with_discount).toFixed(2))
            price_with_discount*=response[0].quantity_products
            let discount_sell = price_with_discount * aux[0].discount
            price_with_discount -= discount_sell
            price_with_discount += montoImponible * response[0].quantity_products
          }
        }) */
     // }
    //})
    return price_with_discount
  }
  ngOnDestroy() {
    this.data$?.unsubscribe();
  }
}
