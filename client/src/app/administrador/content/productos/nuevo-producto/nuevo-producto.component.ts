import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { category, alert, building, product } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { CategoriasService } from '../../administracion/categorias/service/categorias.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductosService } from '../productos-en-almacen/service/productos.service';
import { EmpresaService } from '../../configuraciones/service/empresa.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent extends DinamicInput {
  formNewProduct!: FormGroup;
  categories: category[] = []
  vence: boolean = true
  ruta!: string
  building!: building
  title: string[] = [];
  id_product!: number;
  productToUpdate!: product

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder,
    public routes: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private categoriesSvc: CategoriasService,
    private empresaSvc: EmpresaService,
    private productsSvc: ProductosService,
    protected override renderer: Renderer2,
    private route: ActivatedRoute) {
    super();
  }
  ngOnInit() {

    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      this.title = []
      if (this.ruta.indexOf("actualizar")) {
        this.title.push("fas fa-box fa-fw");//aañado el icono del titulo al array
      } else {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    });
    if (this.routes.url.includes("actualizar")) {
      this.route.paramMap.subscribe((params: ParamMap) => {
        this.id_product = Number(params.get('id_product'));
        this.productsSvc.getProducto(this.id_product).subscribe({
          next: res => {
            console.log(res)
            if
              (res instanceof Array) {
              this.formNewProduct.get('barcode')?.setValue(res[0].barcode)
              this.formNewProduct.get('name')?.setValue(res[0].name)
              this.formNewProduct.get('mark')?.setValue(res[0].mark)
              this.formNewProduct.get('model')?.setValue(res[0].model)
              this.formNewProduct.get('discount')?.setValue(res[0].discount)
              this.formNewProduct.get('garanty')?.setValue(res[0].garanty)
              this.formNewProduct.get('can_expir')?.setValue(res[0].can_expir.toString())
              this.formNewProduct.get('time_garanty')?.setValue(res[0].time_garanty)
              this.formNewProduct.get('id_category')?.setValue(res[0].id_category)
              this.formNewProduct.get('impuest')?.setValue(res[0].impuest)
              this.productToUpdate = res[0]
            } else {
              this.changeModal(res)
              this.popUp?.nativeElement.showModal()
            }
          },
          error: (error: HttpErrorResponse) => {
            this.error(error)
          }
        });
      });
    }
    this.categoriesSvc.getCategories().subscribe(
      res => { this.categories = res }
    )
    this.empresaSvc.getBuildings().subscribe(
      res => { this.building = res[0] }
    )
    this.formNewProduct = this.fb.group(
      {
        barcode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
        name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
        mark: new FormControl('', [Validators.pattern(/^[a-zA-Z ]+$/)]),
        model: new FormControl('', [Validators.pattern(/^[a-zA-Z ]+$/)]),
        discount: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
        garanty: new FormControl('Habilitada', [Validators.required]),
        time_garanty: new FormControl(null),
        id_category: new FormControl(0,[Validators.required]),
        impuest: new FormControl([Validators.required]),
        can_expir: new FormControl('true')
      }
    )
    if (this.routes.url.includes('nuevo')) {
      this.setValidator('garanty', 'Habilitada', 'time_garanty')
    }
  }
  setValidator(father: string, valueFather: string, son: string) {
    console.log(this.formNewProduct.get(father)?.value)
    if (this.formNewProduct.get(father)?.value === valueFather) {
      this.formNewProduct.get(son)?.setValidators([Validators.required])
    } else {
      this.formNewProduct.get(son)?.removeValidators([Validators.required])
    }
    this.formNewProduct.get(son)?.updateValueAndValidity()
  }
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListProducts();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizado') &&
      this.ruta.includes("actualizar")) {
      this.redirectToListProducts();
    }
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  validarUpdate() {
    if (this.formNewProduct.get('barcode')?.value === this.productToUpdate.barcode &&
      this.formNewProduct.get('name')?.value === this.productToUpdate.name &&
      this.formNewProduct.get('mark')?.value === this.productToUpdate.mark &&
      this.formNewProduct.get('model')?.value === this.productToUpdate.model &&
      this.formNewProduct.get('discount')?.value === this.productToUpdate.discount &&
      this.formNewProduct.get('garanty')?.value === this.productToUpdate.garanty &&
      this.formNewProduct.get('time_garanty')?.value === this.productToUpdate.time_garanty &&
      this.formNewProduct.get('id_category')?.value === this.productToUpdate.id_category &&
      this.formNewProduct.get('impuest')?.value === this.productToUpdate.impuest &&
      this.formNewProduct.get('can_expir')?.value === ((this.productToUpdate.expir === null) ? 'No vence' : 'Si vence')) {
      let msj: alert = {
        icon: '',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos del producto ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.productToUpdate.barcode=this.formNewProduct.get('barcode')?.value
      this.productToUpdate.name=this.formNewProduct.get('name')?.value
      this.productToUpdate.mark= this.formNewProduct.get('mark')?.value 
      this.productToUpdate.model=this.formNewProduct.get('model')?.value
      this.productToUpdate.discount= Number((this.formNewProduct.get('discount')?.value/100).toFixed(2))
      this.productToUpdate.garanty=this.formNewProduct.get('garanty')?.value
      this.productToUpdate.time_garanty=this.formNewProduct.get('time_garanty')?.value 
      this.productToUpdate.id_category= this.formNewProduct.get('id_category')?.value 
      this.productToUpdate.impuest=this.formNewProduct.get('impuest')?.value
      this.productToUpdate.can_expir= this.formNewProduct.get('can_expir')?.value
      this.update()
    }
  }
  update() {
    this.productsSvc.updateProducto(Number(this.id_product),
     this.productToUpdate).subscribe({
        next: res => {
          console.log(res)
          this.changeModal(res);
          this.popUp?.nativeElement.showModal();
        },
        error: (error: HttpErrorResponse) => {
          this.error(error);
        }
      })
  }
  redirectToListProducts() {
    this.routes.navigate(['/productos/productos en almacen'])
  }

  submit() {
    console.log(this.formNewProduct.value)
    this.productsSvc.setProducto(this.formNewProduct.value).subscribe({
      next: res => {
        console.log(res)
        this.changeModal(res);
        this.popUp?.nativeElement.showModal()
      },
      error: (error: HttpErrorResponse) => {
        this.error(error)
      }
    })
  }
  clean() {
    this.formNewProduct.get('barcode')?.setValue('');
    this.formNewProduct.get('name')?.setValue('');
    this.formNewProduct.get('mark')?.setValue('');
    this.formNewProduct.get('model')?.setValue('');
    this.formNewProduct.get('discount')?.setValue('');
    this.formNewProduct.get('timeUnit')?.setValue('');
  }

}
