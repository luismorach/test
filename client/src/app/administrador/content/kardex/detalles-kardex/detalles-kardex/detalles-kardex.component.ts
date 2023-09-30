import { Component, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComprasService } from 'src/app/administrador/content/compras/service/compras.service';
import { buy, buy_product, coin, kardex, product, repayment, sell, sell_product } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicTable } from 'src/app/utils/DinamicTable';
import { Location } from '@angular/common';
import { CoinsService } from 'src/app/administrador/content/configuraciones/service/coins.service';
import { KardexService } from '../../service/kardex.service';
import { VentasService } from 'src/app/administrador/content/ventas/service/ventas.service';
import { DevolucionesService } from 'src/app/administrador/content/devoluciones/service/devoluciones.service';

@Component({
  selector: 'app-detalles-kardex',
  templateUrl: './detalles-kardex.component.html',
  styleUrls: ['./detalles-kardex.component.css']
})
export class DetallesKardexComponent extends DinamicTable {
  productOperation!: buy_product | sell_product
  sell!: sell
  repayment!: repayment
  ruta!: string
  title: string[] = []
  kardex!: kardex
  mainCoin!: coin
  product!: product
  constructor(private routes: Router,
    public comunicatorSvc: ComunicatorComponetsService,
    public override renderer: Renderer2,
    private route: ActivatedRoute,
    private location: Location,
    private ventasSvc: VentasService,
    private comprasSvc: ComprasService,
    private devolucionesSvc: DevolucionesService,
    private coinsSvc: CoinsService,
    private kardexSvc: KardexService) {
    super(renderer)
  }
  ngOnInit() {
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      this.title.push("fas fa-pallet fa-fw");//aañado el icono del titulo al array
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    });
    this.coinsSvc.getMainCoin().subscribe(res => {
      if (res instanceof Array)
        this.mainCoin = res[0]
    })
    this.route.queryParams.subscribe((params) => {
      this.comprasSvc.getProductBuy(params['id'], params['id_product']).subscribe(res => {
        if (res instanceof Array)
          this.productOperation = res[0]
      })
      this.ventasSvc.getProductSell(params['id'], params['id_product']).subscribe(res => {
        if (res instanceof Array)
          this.productOperation = res[0]
        this.ventasSvc.getSell(params['id']).subscribe(res => {
          if (res instanceof Array){
            let aux:any=res
            this.sell = aux[0]
          }
        })
      })
      this.devolucionesSvc.getRepayment(params['id']).subscribe(res => {
        if (res instanceof Array) {
          if (res[0].id_buy !== undefined) {
            this.comprasSvc.getProductBuy(res[0].id_buy, params['id_product']).subscribe(res => {
              if (res instanceof Array) {
                this.productOperation = res[0]
              }
            })
          }
          if (res[0].id_sell !== undefined) {
            this.ventasSvc.getProductSell(res[0].id_sell, params['id_product']).subscribe(res => {
              if (res instanceof Array)
                this.productOperation = res[0]
            })
          }

        }
      })
      this.kardexSvc.getKardexById(params['type'], params['id'], params['id_product']).subscribe(res => {
        if (res instanceof Array) {
          let aux: any = res
          this.kardex = aux[0]
          this.product = aux[0]
        }
      })
    })

  }

  calcularMontoImponible(price: number) {
    let price_wiht_discount = Number((price - (Number((price * this.productOperation.discount_product).toFixed(2)))).toFixed(2))
    let montoImponible = Number((this.productOperation.impuest * price_wiht_discount).toFixed(2))
    return montoImponible
  }
  calcularDescuentoVenta(){
    let price_with_discount= Number(((this.productOperation.sell_price-Number((this.productOperation.sell_price*
      this.productOperation.discount_product).toFixed(2)))*this.productOperation.quantity_products).toFixed(2))
    let discount_sell=price_with_discount*this.sell.discount
    price_with_discount-=discount_sell
    price_with_discount+=this.calcularMontoImponible(this.productOperation.sell_price)*
    this.productOperation.quantity_products
    return {price:price_with_discount,value_discount:discount_sell}
  }
  
  redirectToKardex() {
    this.location.back()
  }
}
