import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { ComprasService } from '../service/compras.service';
import { alert, buy, buy_product, product, provider, user, repayment } from 'src/app/interfaces/interfaces';
import { ProveedoresService } from '../../administracion/proveedores/service/proveedores.service';
import { UsuariosService } from '../../administracion/usuarios/service/usuarios.service';
import { ProductosService } from '../../productos/productos-en-almacen/service/productos.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { Location } from '@angular/common';
import { DevolucionesService } from '../../devoluciones/service/devoluciones.service';

@Component({
  selector: 'app-detalles-compra',
  templateUrl: './detalles-compra.component.html',
  styleUrls: ['./detalles-compra.component.css']
})
export class DetallesCompraComponent extends DinamicInput {
  ruta!: string
  title: string[] = []
  buy!: buy
  provider!: provider
  user!: user
  buy_products: buy_product[] = []
  repayments: repayment[] = []
  products: product[] = []
  indexElementToBack!: number
  formDevolucion!: FormGroup
  @ViewChild('quantity', { static: true }) quantityBack?: ElementRef;
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private routes: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    public override renderer: Renderer2,
    private route: ActivatedRoute,
    private comprasSvc: ComprasService,
    private proveedoresSvc: ProveedoresService,
    private usuariosSvc: UsuariosService,
    private productosSvc: ProductosService,
    private fb: FormBuilder,
    private location: Location,
    private devolucionesSvc: DevolucionesService) {
    super()
  }

  ngOnInit() {
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.title.push("fas fa-shopping-bag fa-fw");//aañado el icono del titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    });
    this.route.queryParams.subscribe((params) => {
      this.comprasSvc.getBuy(params['id_buy']).subscribe(res => {
        if (res instanceof Array) {
          this.buy = res[0]
          this.proveedoresSvc.getProvider(this.buy.id_provider).subscribe(res => {
            if (res instanceof Array) {
              this.provider = res[0]
            }
          })
          this.usuariosSvc.getUser(this.buy.id_user).subscribe(res => {
            if (res instanceof Array) {
              this.user = res[0]
            }
          })

          this.comprasSvc.getProductsBuy(params['id_buy']).subscribe(res => {
            console.log(res)
            if (res instanceof Array) {

              this.buy_products = res
              this.buy_products.forEach((buy_product: buy_product) => {
                this.productosSvc.getProducto(buy_product.id_product).subscribe(res => {
                  if (res instanceof Array) {
                    this.products.push(res[0])
                  }
                })

              })
            }
          })
          this.devolucionesSvc.getRepaymentsBuy(params['id_buy']).subscribe(
            res => {
              if (res instanceof Array)
                this.repayments = res
            })
        }
      })
    })
    this.formDevolucion = this.fb.group({
      quantity_back: new FormControl('')
    })
  }
  showModal(product: product, index: number) {
    this.indexElementToBack = index
    this.renderer.setProperty(this.quantityBack?.nativeElement.children[0].children[0],
      'textContent', 'Realizar Devolución (' + product.name + ' ' + product.mark + ' ' + product.model + ')')
    this.quantityBack?.nativeElement.showModal()
  }
  calcularPromedio(price: number) {
    return ((this.products[this.indexElementToBack].sell_price *
      this.products[this.indexElementToBack].exist_quantity) -
      (this.buy_products[this.indexElementToBack].sell_price *
        Number(this.formDevolucion.get('quantity_back')?.value))) /
      (this.products[this.indexElementToBack].exist_quantity -
        Number(this.formDevolucion.get('quantity_back')?.value))
  }
  registrarDevolucion() {
    let content = ''
    if (Number(this.formDevolucion.get('quantity_back')?.value) >
      (this.buy_products[this.indexElementToBack].quantity_products -
        this.buy_products[this.indexElementToBack].quantity_back)) {
      content = 'La cantidad a devolver es mayor a la registrada en la compra'
    } else if ((this.products[this.indexElementToBack].exist_quantity -
      Number(this.formDevolucion.get('quantity_back')?.value)) < 0) {
      content = 'No existe esa cantidad en el almacen, los productos ya han sido vendidos'
    } else {
      let repayment: repayment = {
        type: 'Devolución de compra',
        date: new Date(),
        id_buy: this.buy_products[this.indexElementToBack].id_buy,
        quantity: Number(this.formDevolucion.get('quantity_back')?.value),
        buy_price: this.buy_products[this.indexElementToBack].buy_price,
        sell_price:this.buy_products[this.indexElementToBack].sell_price,
        total: Number(this.formDevolucion.get('quantity_back')?.value) *
          this.buy_products[this.indexElementToBack].buy_price,
        coin: this.buy.coin,
        exchange:this.buy.exchange,
        exist_quantity: this.products[this.indexElementToBack].exist_quantity - Number(this.formDevolucion.get('quantity_back')?.value),
        weighted_averages_sell: Number((((this.products[this.indexElementToBack].sell_price *
          this.products[this.indexElementToBack].exist_quantity) -
          (this.comunicatorSvc.converterToMainCoin(this.buy_products[this.indexElementToBack].sell_price, this.buy.exchange) *
            Number(this.formDevolucion.get('quantity_back')?.value))) /
          (this.products[this.indexElementToBack].exist_quantity -
            Number(this.formDevolucion.get('quantity_back')?.value))).toFixed(2)),
        weighted_averages_buy:Number((((this.products[this.indexElementToBack].buy_price *
          this.products[this.indexElementToBack].exist_quantity) -
          (this.comunicatorSvc.converterToMainCoin(this.buy_products[this.indexElementToBack].buy_price, this.buy.exchange) *
            Number(this.formDevolucion.get('quantity_back')?.value))) /
          (this.products[this.indexElementToBack].exist_quantity -
            Number(this.formDevolucion.get('quantity_back')?.value))).toFixed(2)),
        id_user: this.buy.id_user,
        id_product: this.buy_products[this.indexElementToBack].id_product,
      }
      repayment.weighted_averages_buy=(isNaN(repayment.weighted_averages_buy))?0:repayment.weighted_averages_buy
      repayment.weighted_averages_buy = this.comunicatorSvc.converterToSecondaryCoin(repayment.weighted_averages_buy, this.buy.exchange)
      repayment.weighted_averages_sell=(isNaN(repayment.weighted_averages_sell))?0:repayment.weighted_averages_sell
      repayment.weighted_averages_sell = this.comunicatorSvc.converterToSecondaryCoin(repayment.weighted_averages_sell, this.buy.exchange)
      this.devolucionesSvc.setRepaymentBuy(repayment).subscribe(res => {
        if (res.title.includes('Registrada')) {
          this.repayments.push(repayment)
        }
        console.log(res)
        this.changeModal(res)
        this.popUp?.nativeElement.showModal()
      })
    }
    if (content !== '') {
      let values: alert = {
        icon: 'fa-regular fa-circle-xmark',
        title: 'Ocurrió un error inesperado',
        content: content
      }
      this.changeModal(values)
      this.popUp?.nativeElement.showModal()
    }
  }

  calcularTotal() {
    this.quantityBack?.nativeElement
    let total = 0;
    this.buy_products.forEach((buy_product: buy_product) => {
      total += buy_product.buy_price * buy_product.quantity_products
    })
    return total
  }
  redirectToComprasRealizadas() {
    this.location.back()
  }
  product(repayment: repayment) {
    let name_product = ''
    this.products.forEach((product: product) => {
      if (product.id_product === repayment.id_product) {
        name_product = product.name + ' ' + product.mark + ' ' + product.model
      }
    })
    return name_product
  }
  acept() {
    if (this.popUp?.nativeElement.children[1].textContent === 'Ocurrió un error inesperado') {
      this.cancel(this.popUp)
    } else {
      this.cancel(this.popUp)
      this.cancel(this.quantityBack)
    }
  }
}
