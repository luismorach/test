import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { CategoriasService } from '../service/categorias.service';
import { HttpErrorResponse } from '@angular/common/http';
import { alert, category } from 'src/app/interfaces/interfaces';
import { Subscription, mergeMap } from 'rxjs';

@Component({
  selector: 'app-nueva-categoria',
  templateUrl: './nueva-categoria.component.html',
  styleUrls: ['./nueva-categoria.component.css']
})

export class NuevaCategoriaComponent extends DinamicInput {

  formNewCategory!: FormGroup;
  usedClass: string[] = [];
  title!: string[];
  ruta!: string;
  categoryToUpdate!: category
  data!:Subscription
  responseServer={
    next: (res:alert) => {
      this.changeModal(res);
      this.popUp?.nativeElement.showModal();
    },
    error: (error: HttpErrorResponse) => {
      this.error(error);
    }
  }

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;


  constructor(private fb: FormBuilder,
    public routes: Router,
    private comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private categoriasSvc: CategoriasService,
    protected override renderer: Renderer2) {
    super();

  }

  ngOnInit() {
    setTimeout(() => {
      this.usedClass[0] = "input-on-focus";
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      this.title = []
      if (this.ruta.indexOf("actualizar")) {
        this.title.push("fa fa-tags fa-fw");//añado el icono del titulo al array
      } else {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    })
    this.formNewCategory = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
      ubication: new FormControl('', [Validators.required])
    })
    if (this.routes.url.includes("actualizar")) {
      const categories = this.route.paramMap.pipe(mergeMap((res: any) => [res]),
        mergeMap((res: any) => this.categoriasSvc.getCategory(res.params.id_category)))
      this.data=categories.subscribe({
        next: res => {
          if (res instanceof Array) {
            this.formNewCategory.get('name')?.setValue(res[0].name)
            this.formNewCategory.get('ubication')?.setValue(res[0].ubication)
            this.categoryToUpdate = res[0]
          } else {
            this.changeModal(res)
            this.popUp?.nativeElement.showModal()
          }
        },
        error: (error: HttpErrorResponse) => {
          this.error(error)
        }
      });
    }
  }

  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }

  submit() {
    this.categoriasSvc.setCategory(this.formNewCategory.value).subscribe(this.responseServer)
  }
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListCategories();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizada') &&
      this.ruta.indexOf("nueva")) {
      this.redirectToListCategories();
    }
  }

  update() {
    this.categoriasSvc.updateCategory(Number(this.categoryToUpdate.id_category),
      this.formNewCategory.value).subscribe(this.responseServer)
  }
  
  validarUpdate() {
    if (this.formNewCategory.get('name')?.value === this.categoryToUpdate.name &&
      this.formNewCategory.get('ubication')?.value === this.categoryToUpdate.ubication) {
      let msj: alert = {
        icon: 'fa-regular fa-circle-question',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos de la categoría ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.update()
    }
  }


  redirectToListCategories() {
    this.routes.navigate(['/administracion/lista categorías'])
  }

  clean() {
    this.formNewCategory.get('name')?.setValue('');
    this.formNewCategory.get('ubication')?.setValue('');
  }

  ngOnDestroy(){
    if(this.data != undefined){
      this.data.unsubscribe()
    }
  }
}
