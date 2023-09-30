import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { provider, alert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { ProveedoresService } from '../service/proveedores.service';
import { Subscription, mergeMap } from 'rxjs';

@Component({
  selector: 'app-nuevo-proveedor',
  templateUrl: './nuevo-proveedor.component.html',
  styleUrls: ['./nuevo-proveedor.component.css']
})
export class NuevoProveedorComponent extends DinamicInput {

  formNewProvider!: FormGroup;
  usedClass: string[] = [];
  data!:Subscription
  title!: string[];
  ruta!: string;
  id_provider!: number;
  providerToUpdate!: provider
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
    private comunicatorSvc$: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private providersSvc: ProveedoresService,
    protected override renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.usedClass[0] = "input-on-focus";
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      this.title = []
      if (this.ruta.indexOf("actualizar")) {
        this.title.push("fa fa-shipping-fast fa-fw");//añado el icono del titulo al array
      } else {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc$.setTitleComponent(this.title);
    })
    if (this.routes.url.includes("actualizar")) {
      const providers = this.route.paramMap.pipe(mergeMap((res: any) => [res]),
        mergeMap((res: any) => this.providersSvc.getProvider(res.params.id_provider)))
      this.data = providers.subscribe({
          next: res => {
            if (res instanceof Array) {
              this.formNewProvider.get('document_type')?.setValue(res[0].document_type)
              this.formNewProvider.get('document_number')?.setValue(res[0].document_number)
              this.formNewProvider.get('name_provider')?.setValue(res[0].name_provider)
              this.formNewProvider.get('address_provider')?.setValue(res[0].address_provider)
              this.formNewProvider.get('name_boss')?.setValue(res[0].name_boss)
              this.formNewProvider.get('phone_number')?.setValue(res[0].phone_number)
              this.formNewProvider.get('email')?.setValue(res[0].email)
              this.providerToUpdate = res[0]
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
    this.formNewProvider = this.fb.group({
      document_type: new FormControl('V-'),
      document_number: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/),Validators.maxLength(10)]),
      name_provider: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z .]+$/)]),
      address_provider: new FormControl('', [Validators.pattern(/^[a-zA-Z ]+$/)]),
      name_boss: new FormControl('', [Validators.pattern(/^[a-zA-Z ]+$/)]),
      phone_number: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
      email: new FormControl('', [Validators.email]),
    })
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc$.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  submit() {
    this.providersSvc.setProvider(this.formNewProvider.value).subscribe(this.responseServer)
  }
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListProviders();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizado') &&
      this.ruta.includes("actualizar")) {
      this.redirectToListProviders();
    }
  }

  update() {
    this.providersSvc.updateProvider(Number(this.providerToUpdate.id_provider),
      this.formNewProvider.value).subscribe(this.responseServer)
  }
 
  validarUpdate() {
    if (this.formNewProvider.get('document_type')?.value === this.providerToUpdate.document_type &&
      this.formNewProvider.get('document_number')?.value === this.providerToUpdate.document_number &&
      this.formNewProvider.get('name_provider')?.value === this.providerToUpdate.name_provider &&
      this.formNewProvider.get('address_provider')?.value === this.providerToUpdate.address_provider &&
      this.formNewProvider.get('name_boss')?.value === this.providerToUpdate.name_boss &&
      this.formNewProvider.get('phone_number')?.value === this.providerToUpdate.phone_number &&
      this.formNewProvider.get('email')?.value === this.providerToUpdate.email) {
      let msj: alert = {
        icon: 'fa-regular fa-circle-question',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos del proveedor ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.update()
    }
  }

  redirectToListProviders() {
    this.routes.navigate(['/administracion/lista proveedores'])
  }
  clean() {
    this.formNewProvider.get('document_type')?.setValue('V-')
    this.formNewProvider.get('document_number')?.setValue('')
    this.formNewProvider.get('name_provider')?.setValue('')
    this.formNewProvider.get('address_provider')?.setValue('')
    this.formNewProvider.get('name_boss')?.setValue('')
    this.formNewProvider.get('phone_number')?.setValue('')
    this.formNewProvider.get('email')?.setValue('')
  }
  ngOnDestroy(){
    if(this.data !=undefined){
      this.data.unsubscribe()
    }
  }
}
