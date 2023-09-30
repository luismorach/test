import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { buy_product, product, provider, buy, coin } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { ProveedoresService } from '../../administracion/proveedores/service/proveedores.service';
import { ProductosService } from '../../productos/productos-en-almacen/service/productos.service';
import { ComprasService } from '../service/compras.service';
import { CoinsService } from '../../configuraciones/service/coins.service';
@Component({
  selector: 'app-nueva-compra',
  templateUrl: './nueva-compra.component.html',
  styleUrls: ['./nueva-compra.component.css']
})

export class NuevaCompraComponent extends DinamicInput {

  formNewBuy!: FormGroup;
  tableSearch!: FormGroup;
  providers: provider[] = []
  products: product[] = []
  listProductsToBuy: buy_product[] = []
  product!: product
  listProducts: product[] = []
  date = new Date()
  price!: number;
  coins: coin[] = []
  coinSelected!: coin

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;
  @ViewChild('searchProducts', { static: true }) search?: ElementRef;
  @ViewChild('quantity', { static: true }) quantityProduct?: ElementRef;

  constructor(private fb: FormBuilder,
    private routes: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private providersSvc: ProveedoresService,
    private productsSvc: ProductosService,
    protected override renderer: Renderer2,
    private comprasServices: ComprasService,
    private coinsSvc: CoinsService) {
    super();
  }

  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      title.push("fas fa-shopping-bag fa-fw");//aañado el icono del titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    });

    this.providersSvc.getProviders().subscribe(
      providers => this.providers = providers
    )
    this.coinsSvc.getCoins().subscribe({
      next: res => {
        this.coins = res
        res.forEach((coin: coin) => {
          if (coin.type === 'principal')
            this.coinSelected = coin
        })
      },
      complete: () => {
        this.formNewBuy.get('coin')?.setValue(this.coinSelected.symbol)
      }
    })

    this.productsSvc.getProductos().subscribe(res => this.listProducts = res)
    this.formNewBuy = this.fb.group({
      barcode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      productQuantity: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      productQuantityBySearch: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      coin: new FormControl(),
      provider: new FormControl('')
    })
    this.tableSearch = new FormGroup({
      search: new FormControl(),
    });

  }
  selectMoneda() {
    this.coins.forEach((coin) => {
      if (coin.symbol === this.formNewBuy.get('coin')?.value) {
        this.coinSelected = coin
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

  addProduct() {
    let quantity: number
    if (this.formNewBuy.get('productQuantity')?.value === '') {
      quantity = 1
    } else {
      quantity = this.formNewBuy.get('productQuantity')?.value
    }

    if (this.formNewBuy.valid) {
      this.productsSvc.getProductoByBarcode(this.formNewBuy.get('barcode')?.value).subscribe(
        product => {
          if (product instanceof Array) {

            if (!this.verificarProductoAñadido(product[0])) {
              product[0].expir = null
              this.listProductsToBuy.push({
                id_buy: 0, id_product: product[0].id_product,
                buy_price: 0, sell_price: 0, weighted_averages_sell: 0, weighted_averages_buy: 0,
                quantity_products: quantity, exist_products: 0, quantity_back: 0,
                discount_product:product[0].discount,impuest:product[0].impuest
              })
              this.products.push(product[0])
            }
          } else {
            this.changeModal(product)
            this.popUp?.nativeElement.showModal()
            this.formNewBuy.get('barcode')?.setValue('')
            this.formNewBuy.get('productQuantity')?.setValue('')
          }
        })
    }
  }
  addQuantity(product: product) {
    if (this.verificarProductoAñadido(product)) {
      let values = {
        icon: 'fa-regular fa-circle-xmark',
        title: 'Ocurrió un error inesperado',
        content: 'Este producto ya se encuentra agregado a la compra'
      }
      this.changeModal(values)
      this.popUp?.nativeElement.showModal()
    } else {
      this.quantityProduct?.nativeElement.showModal()
      this.product = product
    }
  }


  addProductBySearch(product: product) {
    let quantity = this.formNewBuy.get('productQuantityBySearch')?.value
    this.listProductsToBuy.push({
      id_buy: 0, id_product: product.id_product,
      buy_price: 0, sell_price: 0, weighted_averages_sell: 0, weighted_averages_buy: 0,
      quantity_products: quantity, exist_products: 0, quantity_back: 0,
      discount_product:product.discount,impuest:product.impuest
    })
    this.products.push(product)
    this.cancel(this.quantityProduct)
    this.cancel(this.search)
  }

  calcularSubtotal(product: product, index: number) {
    return this.listProductsToBuy[index].buy_price * this.listProductsToBuy[index].quantity_products

  }

  calcularTotal() {
    let total = 0
    this.products.forEach((product: product, index: number) => {
      total += this.listProductsToBuy[index].buy_price * this.listProductsToBuy[index].quantity_products
    });
    return total
  }

  delete(index: number) {
    this.products.splice(index, 1)
    this.listProductsToBuy.splice(index, 1)
  }

  searchProduct() {
    this.search?.nativeElement.showModal();
  }
  validarCompra() {
    let result = { isValid: false, msj: 'Agrege productos a la compra' }
    this.products.forEach((product: product, index: number) => {
      if (this.formNewBuy.get('provider')?.value === '') {
        result = { isValid: false, msj: 'Debe selecionar un proveedor' }
      } else if (product.expir === null && product.can_expir) {
        result = { isValid: false, msj: 'La fecha de vencimiento del ' + product.name + ' es invalida' }
      } else {
        this.listProductsToBuy.forEach((productBuy: buy_product) => {
          if (productBuy.quantity_products < 1) {
            result = { isValid: false, msj: 'La cantidad del' + product.name + 'no puede ser 0' }
          } else if (Number(productBuy.buy_price) === 0) {
            result = { isValid: false, msj: 'El precio de compra del producto ' + product.name + 'no puede ser 0' }
          } else if (Number(productBuy.sell_price) === 0) {
            result = { isValid: false, msj: 'El precio de venta del producto ' + product.name + ' no puede ser 0' }
          } else if (Number(productBuy.sell_price) < Number(productBuy.buy_price)) {
            result = { isValid: false, msj: 'El precio de venta del producto ' + product.name + ' no puede ser menor al precio de compra' }
          } else {
            result = { isValid: true, msj: '' }
          }
        })
      }
    })
    return result
  }

  acept(index: number) {
    if (this.popUp?.nativeElement.children[1].textContent.includes('error')) {
      this.popUp?.nativeElement.close()
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('¿Estás seguro?')) {
      this.delete(index)
      this.popUp?.nativeElement.close()
    } else {
      this.popUp?.nativeElement.close()
    }
  }

  registrarCompra() {

    if (this.validarCompra().isValid) {
      this.products.forEach((product: product, index: number) => {
        this.listProductsToBuy[index].exist_products = Number(product.exist_quantity) +
          Number(this.listProductsToBuy[index].quantity_products)
        this.listProductsToBuy[index].weighted_averages_sell = Number((((Number(product.sell_price) *
          Number(product.exist_quantity)) +
          (this.comunicatorSvc.converterToMainCoin(Number(this.listProductsToBuy[index].sell_price), this.coinSelected.exchange) *
            Number(this.listProductsToBuy[index].quantity_products))) /
          Number(this.listProductsToBuy[index].exist_products)).toFixed(2))

        this.listProductsToBuy[index].weighted_averages_buy = Number((((Number(product.buy_price) * Number(product.exist_quantity)) +
          (this.comunicatorSvc.converterToMainCoin(Number(this.listProductsToBuy[index].buy_price), this.coinSelected.exchange) *
            Number(this.listProductsToBuy[index].quantity_products))) /
          this.listProductsToBuy[index].exist_products).toFixed(2))
        this.listProductsToBuy[index].weighted_averages_sell = this.comunicatorSvc.converterToSecondaryCoin(
          this.listProductsToBuy[index].weighted_averages_sell, this.coinSelected.exchange)
        this.listProductsToBuy[index].weighted_averages_buy = this.comunicatorSvc.converterToSecondaryCoin(
          this.listProductsToBuy[index].weighted_averages_buy, this.coinSelected.exchange)
      })

      let buy: buy = {
        total_buy: this.calcularTotal(),
        coin: this.formNewBuy.get('coin')?.value.toString(),
        exchange: this.coinSelected.exchange,
        id_provider: Number(this.formNewBuy.get('provider')?.value),
        buy_products: this.listProductsToBuy,
        id_user: 16
      }
      this.comprasServices.setBuy(buy).subscribe(
        res => {
          console.log(res)
          this.changeModal(res);
          this.popUp?.nativeElement.showModal()
        })
    }
  }
}
