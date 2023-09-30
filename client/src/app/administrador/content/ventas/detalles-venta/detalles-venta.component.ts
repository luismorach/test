import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { product, repayment, sell, sell_product, user, alert, pay, register, client } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { VentasService } from '../service/ventas.service';
import { UsuariosService } from '../../administracion/usuarios/service/usuarios.service';
import { ProductosService } from '../../productos/productos-en-almacen/service/productos.service';
import { DevolucionesService } from '../../devoluciones/service/devoluciones.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalles-venta',
  templateUrl: './detalles-venta.component.html',
  styleUrls: ['./detalles-venta.component.css']
})
export class DetallesVentaComponent extends DinamicInput {

  ruta!: string
  title: string[] = []
  sell!: sell
  user_sell!: user
  user_pay: user[] = []
  users_repayment: user[] = []
  client!: client
  register_sell!: register
  registers_pay: register[] = []
  registers_repayment: register[] = []
  sell_products: sell_product[] = []
  repayments: repayment[] = []
  products: product[] = []
  pays: pay[] = []
  indexElementToBack!: number
  formDevolucion!: FormGroup
  @ViewChild('quantity', { static: true }) quantityBack?: ElementRef;
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private routes: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    public override renderer: Renderer2,
    private route: ActivatedRoute,
    private ventasSvc: VentasService,
    private fb: FormBuilder,
    private location: Location,
    private devolucionesSvc: DevolucionesService) {
    super()
  }

  ngOnInit() {
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('?'));
      this.title.push("fas fa-coins fa-fw");//aañado el icono del titulo al array
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    });
    this.route.queryParams.subscribe((params) => {
      this.ventasSvc.getSell(params['id_sell']).subscribe(res => {
        let aux: any = res
        this.sell = aux[0]
        this.user_sell = aux[0]
        this.client = aux[0]
        this.register_sell = aux[0]
      })
      this.ventasSvc.getProductsSell(params['id_sell']).subscribe(res => {
        if (res instanceof Array) {
          console.log(res)
          console.log('epa')
          let aux: any = res
          this.products = aux
          this.sell_products = aux
          console.log(this.sell_products)
        }
      })
      this.ventasSvc.getPaysSell(params['id_sell']).subscribe(res => {
        if (res instanceof Array) {
          let aux: any = res
          this.user_pay = aux
          this.registers_pay = aux
          this.pays = aux
        }
      })
      this.devolucionesSvc.getRepaymentsSell(params['id_sell']).subscribe(res => {
        console.log(res)
        if (res instanceof Array) {
          let aux: any = res
          this.repayments = aux
          this.users_repayment = aux
          this.registers_repayment = aux
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
      (this.sell_products[this.indexElementToBack].sell_price *
        Number(this.formDevolucion.get('quantity_back')?.value))) /
      (this.products[this.indexElementToBack].exist_quantity -
        Number(this.formDevolucion.get('quantity_back')?.value))
  }
  registrarDevolucion() {
    let garanty = new Date(this.products[this.indexElementToBack].time_garanty)
    let today = new Date()
    let content = ''
    if (Number(this.formDevolucion.get('quantity_back')?.value) >
      (this.sell_products[this.indexElementToBack].quantity_products -
        this.sell_products[this.indexElementToBack].quantity_back)) {
      content = 'La cantidad a devolver es mayor a la registrada en la venta'
    } else if (this.products[this.indexElementToBack].time_garanty === null) {
      content = 'No se puede realizar devolución de este producto, el mismo no posee garantia'
    } else if (garanty < today) {
      content = 'La garantia del producto ha caducado'
    } else {
      let repayment: repayment = {
        type: 'Devolución de venta',
        date: new Date(),
        id_sell: this.sell.id_sell,
        quantity: Number(this.formDevolucion.get('quantity_back')?.value),
        sell_price: this.sell_products[this.indexElementToBack].sell_price,
        buy_price:this.sell_products[this.indexElementToBack].buy_price,
        total: Number(this.formDevolucion.get('quantity_back')?.value) *
          this.sell_products[this.indexElementToBack].sell_price,
        coin: this.sell.coin,
        exchange: this.sell.exchange,
        exist_quantity: this.products[this.indexElementToBack].exist_quantity + Number(this.formDevolucion.get('quantity_back')?.value),
        weighted_averages_sell: Number((((this.products[this.indexElementToBack].sell_price *
          this.products[this.indexElementToBack].exist_quantity) +
          (this.comunicatorSvc.converterToMainCoin(this.sell_products[this.indexElementToBack].sell_price, this.sell.exchange) *
            Number(this.formDevolucion.get('quantity_back')?.value))) /
          (this.products[this.indexElementToBack].exist_quantity +
            Number(this.formDevolucion.get('quantity_back')?.value))).toFixed(2)),
        weighted_averages_buy: Number((((this.products[this.indexElementToBack].buy_price *
          this.products[this.indexElementToBack].exist_quantity) +
          (this.comunicatorSvc.converterToMainCoin(this.sell_products[this.indexElementToBack].buy_price, this.sell.exchange) *
            Number(this.formDevolucion.get('quantity_back')?.value))) /
          (this.products[this.indexElementToBack].exist_quantity +
            Number(this.formDevolucion.get('quantity_back')?.value))).toFixed(2)),
        id_user: this.sell.id_user,
        id_product: this.sell_products[this.indexElementToBack].id_product,
      }
      console.log(repayment)
      repayment.weighted_averages_sell = (isNaN(repayment.weighted_averages_sell)) ? 0 : repayment.weighted_averages_sell
      repayment.weighted_averages_sell = this.comunicatorSvc.converterToSecondaryCoin(repayment.weighted_averages_sell, this.sell.exchange)
      
      this.devolucionesSvc.setRepaymentSell(repayment).subscribe(res => {
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

  calcularSubtotal(index: number) {
    let price = this.products[index].sell_price
    let discount = this.products[index].discount
    let quantity = this.sell_products[index].quantity_products
    return Number(((price * quantity) - (Number((price * discount).toFixed(2)) * quantity)).toFixed(2))
  }

  calcularTotal() {
    let total = 0
    this.products.forEach((product: product, index: number) => {
      total += this.calcularSubtotal(index)
    });
    return total
  }
  calcularDescuentoVenta() {
    return Number((this.sell.discount * this.calcularTotal()).toFixed(2))
  }
  calcularImpuestoVenta() {
    let montoImponible = 0
    this.products.forEach((product: product, index: number) => {
      if (product.impuest > 0) {
        let price =product.sell_price
        let discount = product.discount
        let quantity = this.sell_products[index].quantity_products
        let price_wiht_discount=Number((price - (Number((price * discount).toFixed(2)))).toFixed(2))
        montoImponible += Number((product.impuest * price_wiht_discount).toFixed(2))*quantity
      }
    })
    return montoImponible
  }
  calcularCostosVenta() {
    let total = 0
    this.products.forEach((product: product, index: number) => {
      total += product.buy_price * this.sell_products[index].quantity_products
    });
    return total
  }
  total() {
    return Number((this.calcularTotal() + this.calcularImpuestoVenta() - this.calcularDescuentoVenta()).toFixed(2))
  }
  redirectToVentasRealizadas() {
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
