import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { client, coin, pay, product, register, sell, sell_product } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { ProductosService } from '../../productos/productos-en-almacen/service/productos.service';
import { CoinsService } from '../../configuraciones/service/coins.service';
import { ClientesService } from '../../administracion/clientes/service/clientes.service';
import { VentasService } from '../service/ventas.service';

@Component({
  selector: 'app-nueva-venta',
  templateUrl: './nueva-venta.component.html',
  styleUrls: ['./nueva-venta.component.css'],
})
export class NuevaVentaComponent extends DinamicInput {
  tableSearch!: FormGroup
  formNewSell!: FormGroup;
  products: product[] = []
  date = new Date()
  coins: coin[] = []
  clientes: client[] = []
  coinSelected!: coin
  coinPay!: coin
  formNewPay!: FormGroup
  pays: pay[] = []
  sellProducts: sell_product[] = []
  sell: sell = {
    id_sell: 0, total_sell: 0, coin: '',
    exchange: 0, state: '', type_sell: '', sell_products: this.sellProducts,
    total_pay: 0, discount: 0, id_user: 20, id_client: 2, pays: this.pays,
  }
  listProducts: product[] = []
  product!: product
  indexElementToDelete: number = 0
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;
  @ViewChild('searchProducts', { static: true }) search?: ElementRef;
  @ViewChild('quantity', { static: true }) quantityProduct?: ElementRef;
  @ViewChild('client', { static: true }) cliente?: ElementRef;
  @ViewChild('pay', { static: true }) pago?: ElementRef;
  constructor(private fb: FormBuilder, private routes: Router,
    public comunicatorSvc: ComunicatorComponetsService,
    private productsSvc: ProductosService,
    private coinsSvc: CoinsService,
    protected override renderer: Renderer2,
    private clientesSvc: ClientesService,
    private ventasSvc: VentasService) {
    super();
  }
  ngOnInit() {
    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push("fas fa-cart-plus fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    });
    this.coinsSvc.getCoins().subscribe({
      next: res => {
        this.coins = res
        res.forEach((coin: coin) => {
          if (coin.type === 'principal')
            this.coinSelected = coin
          this.coinPay = coin
        })
      },
      complete: () => {
        this.formNewPay.get('coin')?.setValue(this.coinPay.symbol)
        this.formNewSell.get('coin')?.setValue(this.coinSelected.symbol)
      }
    })
    this.clientesSvc.getClients().subscribe(clientes => {
      this.clientes = clientes
      clientes.forEach((cliente: client) => {
        if (cliente.names_client.includes('Publico')) {
          this.formNewSell.get('client')?.setValue(cliente.id_client)
        }
      })
    })
    this.productsSvc.getProductos().subscribe(res => this.listProducts = res)
    this.formNewSell = this.fb.group({
      barcode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      productQuantity: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      client: new FormControl(''),
      productQuantityBySearch: new FormControl(''),
      coin: new FormControl(''),
      type_sell: new FormControl('Contado'),
      discount: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
    })
    this.formNewPay = new FormGroup({
      type: new FormControl('Transacción eléctronica'),
      coin: new FormControl(''),
      mount: new FormControl(0),
      reference: new FormControl()
    })
    this.tableSearch = new FormGroup({
      search: new FormControl(),
    });
  }
  selectMoneda() {
    this.coins.forEach((coin) => {
      if (coin.symbol === this.formNewSell.get('coin')?.value) {
        this.coinSelected = coin
      }
    })
  }
  selectMonedaPay() {
    this.coins.forEach((coin) => {
      if (coin.symbol === this.formNewPay.get('coin')?.value) {
        this.coinPay = coin
      }
    })
  }
  verificarProductoAñadido(product: product) {
    let exist: boolean = false
    this.products.forEach((producto: product) => {
      if (producto.name === product.name) {
        exist = true
      } else {
        exist = false
      }
    })
    return exist
  }
  addQuantity(product: product) {
    let values = {
      icon: 'fa-regular fa-circle-xmark',
      title: 'Ocurrió un error inesperado',
      content: ''
    }
    if (this.verificarProductoAñadido(product)) {
      values.content = 'Este producto ya se encuentra agregado a la venta'
      this.changeModal(values)
      this.popUp?.nativeElement.showModal()
    } else if (product.exist_quantity === 0) {
      values.content = 'No hay existencias de este producto para vender'
      this.changeModal(values)
      this.popUp?.nativeElement.showModal()
    } else {
      this.quantityProduct?.nativeElement.showModal()
      this.product = product
    }
  }
  open() {
    this.cliente?.nativeElement.showModal()
  }
  receiveMessage(client: client) {
    this.clientes.push(client)
    console.log(this.clientes)
    console.log(client)
    this.formNewSell.get('client')?.setValue(client.id_client)
    this.cancel(this.cliente)
  }
  addProduct() {
    let quantity: number
    if (this.formNewSell.get('productQuantity')?.value === '') {
      quantity = 1
    } else {
      quantity = this.formNewSell.get('productQuantity')?.value
    }

    if (this.formNewSell.get('barcode')?.valid) {
      let msj = {
        icon: 'fa-regular fa-circle-xmark',
        title: 'Ocurrió un error inesperado',
        content: ''
      }
      this.productsSvc.getProductoByBarcode(this.formNewSell.get('barcode')?.value).subscribe(
        product => {
          if (product instanceof Array) {
            if (!this.verificarProductoAñadido(product[0])) {
              if (quantity > product[0].exist_quantity) {
                msj.content = 'La cantidad a ingresar del producto es superior a la existente';
                this.changeModal(msj)
                this.popUp?.nativeElement.showModal()
              } else {
                this.sellProducts.push({
                  id_sell: 0, id_product: product[0].id_product,
                  buy_price: product[0].buy_price, sell_price: product[0].sell_price,
                  discount_product: product[0].discount, impuest: product[0].impuest,
                  quantity_products: quantity, exist_products: product[0].exist_quantity,
                  quantity_back: 0
                })
                this.products.push(product[0])
              }
            } else {
              msj.content = 'Este producto ya se encuentra agregado a la venta'
              this.changeModal(msj)
              this.popUp?.nativeElement.showModal()
            }
          } else {
            this.changeModal(product)
            this.popUp?.nativeElement.showModal()
            this.formNewSell.get('barcode')?.setValue('')
            this.formNewSell.get('productQuantity')?.setValue('')
          }
        })
    }
  }
  addProductBySearch(product: product) {
    let quantity = this.formNewSell.get('productQuantityBySearch')?.value
    if (quantity > product.exist_quantity) {
      let msj = {
        icon: 'fa-regular fa-circle-xmark',
        title: 'Ocurrió un error inesperado',
        content: 'La cantidad a ingresar del producto es superior a la existente'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.sellProducts.push({
        id_sell: 0, id_product: product.id_product,
        buy_price: product.buy_price, sell_price: product.sell_price, discount_product: product.discount,
        impuest: product.impuest, quantity_products: quantity, exist_products: product.exist_quantity,
        quantity_back: 0
      })
      this.products.push(product)
      this.cancel(this.quantityProduct)
      this.cancel(this.search)
    }
  }
  acept(index: number) {
    if (this.popUp?.nativeElement.children[1].textContent.includes('error')) {
      this.popUp?.nativeElement.close()
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('¿Estás seguro?')) {
      this.delete(index)
      this.popUp?.nativeElement.close()
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Pago Registrado') &&
      this.comunicatorSvc.converter(this.sell.total_pay, this.coinPay) >=
      this.comunicatorSvc.converter(this.total(), this.coinPay)) {
      this.pago?.nativeElement.close()
      this.popUp.nativeElement.close()
      this.registrarVenta()
    } else {
      this.popUp?.nativeElement.close()
    }
  }
  calcularSubtotal(product: product, index: number) {
    let price = this.comunicatorSvc.converter(this.products[index].sell_price, this.coinSelected)
    let discount = this.products[index].discount
    let quantity = this.sellProducts[index].quantity_products
    return Number(((price * quantity) - (Number((price * discount).toFixed(2)) * quantity)).toFixed(2))
  }

  calcularTotal() {
    let total = 0
    this.products.forEach((product: product, index: number) => {
      total += this.calcularSubtotal(product, index)
    });
    return total
  }
  calcularDescuentoVenta() {
    return Number(((Number(this.formNewSell.get('discount')?.value) / 100) * this.calcularTotal()).toFixed(2))
  }
  calcularImpuestoVenta() {
    let montoImponible = 0
    this.products.forEach((product: product, index: number) => {
      if (product.impuest > 0) {
        let price = this.comunicatorSvc.converter(product.sell_price, this.coinSelected)
        let discount = product.discount
        let quantity = this.sellProducts[index].quantity_products
        let price_wiht_discount=Number((price - (Number((price * discount).toFixed(2)))).toFixed(2))
        montoImponible += Number((product.impuest * price_wiht_discount).toFixed(2))*quantity
      }
    })
    return montoImponible
  }
  total() {
    return Number((this.calcularTotal() + this.calcularImpuestoVenta() - this.calcularDescuentoVenta()).toFixed(2))
  }
  searchProduct() {
    this.search?.nativeElement.showModal();
  }
  delete(index: number) {
    this.products.splice(this.indexElementToDelete, 1)
    this.sellProducts.splice(this.indexElementToDelete, 1)
  }
  validarVenta() {
    let result = { isValid: false, msj: 'Agrege productos a la venta' }
    this.products.forEach((product: product, index: number) => {
      if (this.sellProducts[index].quantity_products === 0) {
        result = { isValid: false, msj: 'La cantidad a vender del producto ' + product.name + 'no puede ser 0' }
      } else if (this.sellProducts[index].quantity_products > product.exist_quantity) {
        result = { isValid: false, msj: 'La cantidad a vender del producto ' + product.name + ' es mayor a la existente' }
      } else if (this.formNewSell.get('type_sell')?.value === 'Crédito' && this.formNewSell.get('client')?.value === 0) {
        result = { isValid: false, msj: 'Para realizar una venta al crédito debe seleccionar un cliente' }
      } else if (this.total() < this.sell.total_pay) {
        result = { isValid: false, msj: 'EL monto pagado por el cliente es mayor al total a pagar por la venta' }
      } else {
        result = { isValid: true, msj: '' }
      }
    })
    return result
  }
  validarPago() {
    let result = { isValid: true, msj: '' }
    if (Number(this.formNewPay.get('mount')?.value) === 0) {
      result = { isValid: false, msj: 'El monto pagado por el cliente no puede ser 0' }
    } else if (this.formNewPay.get('type')?.value.includes('Transacción')) {
      if (Number(this.formNewPay.get('mount')?.value) > this.comunicatorSvc.converter(
        this.total(), this.coinPay)) {
        result = { isValid: false, msj: 'El monto pagado por el cliente no puede ser mayor al total a pagar' }
        console.log(this.total() + ' ' + Number(this.formNewPay.get('mount')?.value))
      } else if (this.formNewPay.get('reference')?.value === null) {
        result = { isValid: false, msj: 'Debe ingresar la referencia del pago realizado' }
      }
    }
    return result
  }
  agregarPago() {
    if (this.validarVenta().isValid) {
      if (this.formNewSell.get('type_sell')?.value === 'Contado') {
        this.pago?.nativeElement.showModal();
      } else {
        this.registrarVenta()
      }
    }
  }
  registrarPago() {
    if (this.validarPago().isValid) {
      let pay: pay = this.formNewPay.value
      pay.exchange = this.coinPay.exchange
      this.sell.total_pay += this.comunicatorSvc.converterToMainCoin(pay.mount, pay.exchange)
      pay.id_user = 16
      this.pays.push(pay)
      let msj = {
        icon: '', title: '¡Pago Registrado!', content: 'El pago se registró  con exito en el sístema'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
      this.formNewPay.get('mount')?.setValue(0)
      this.formNewPay.get('reference')?.setValue(null)
    }
  }
  registrarVenta() {
    this.sell.total_sell = this.total()
    this.sell.coin = this.coinSelected.symbol
    this.sell.exchange = this.coinSelected.exchange
    this.sell.discount = (this.formNewSell.get('discount')?.value === '') ? 0 : (this.formNewSell.get('discount')?.value/100)
    this.sell.type_sell = this.formNewSell.get('type_sell')?.value
    this.sell.state = (this.formNewSell.get('type_sell')?.value === 'Contado') ? 'Cancelado' : 'Pendiente'
    this.sell.id_client = this.formNewSell.get('client')?.value
    this.ventasSvc.setSell(this.sell).subscribe(res => {
      console.log(res)
      this.changeModal(res)
      this.popUp?.nativeElement.showModal()
      this.limpiarVenta()
    })
  }
  limpiarVenta() {
    this.sellProducts.forEach((product: sell_product) => {
      let elemento = this.listProducts.find((element: product) => element.id_product === product.id_product)
      if (elemento != undefined)
        elemento.exist_quantity -=product.quantity_products
    })
    this.products = []
    this.pays = []
    this.sellProducts = []
    this.sell.total_pay = 0
    this.tableSearch.get('search')?.setValue('')
    this.formNewSell.get('productQuantityBySearch')?.setValue('')
  }
}
