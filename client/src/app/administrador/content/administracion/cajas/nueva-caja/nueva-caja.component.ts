import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { CajasService } from '../service/cajas.service';
import { register, alert } from 'src/app/interfaces/interfaces';
import { Subscription, mergeMap } from 'rxjs';

@Component({
  selector: 'app-nueva-caja',
  templateUrl: './nueva-caja.component.html',
  styleUrls: ['./nueva-caja.component.css']
})

export class NuevaCajaComponent extends DinamicInput {

  newRegister!: FormGroup;
  usedClass: string[] = [];
  title!: string[];
  ruta!: string;
  registerToUpdate!: register
  data!: Subscription
  responseServer = {
    next: (res: alert) => {
      this.changeModal(res);
      this.popUp?.nativeElement.showModal();
    },
    error: (error: HttpErrorResponse) => {
      this.error(error);
    }
  }

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder, private comunicatorSvc: ComunicatorComponetsService,
    public routes: Router, private route: ActivatedRoute, protected override renderer: Renderer2,
    private cajasSvc: CajasService) {
    super();

  }

  ngOnInit() {
    setTimeout(() => {
      this.usedClass[0] = "input-on-focus";
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      this.title = []
      if (this.ruta.indexOf("actualizar")) {
        this.title.push("fa-solid fa-cash-register fa-fw");//Aañado el icono del titulo al array
      } else {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    })

    this.newRegister = this.fb.group({
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9 ]+$/)]),
      state: new FormControl('Habilitada')
    })
    if (this.routes.url.includes("actualizar")) {
      const registers = this.route.paramMap.pipe(mergeMap((res: any) => [res]),
        mergeMap((res: any) => this.cajasSvc.getRegister(res.params.id_register)))
      this.data = registers.subscribe({
        next: res => {
          if (res instanceof Array) {
            this.newRegister.get('name')?.setValue(res[0].name)
            this.newRegister.get('state')?.setValue(res[0].state)
            this.registerToUpdate = res[0]
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
    this.cajasSvc.setRegister(this.newRegister.value).subscribe(this.responseServer)
  }
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListRegisters();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizada') &&
      this.ruta.indexOf("nueva")) {
      this.redirectToListRegisters();
    }
  }
  validarUpdate() {
    if (this.newRegister.get('name')?.value === this.registerToUpdate.name &&
      this.newRegister.get('state')?.value === this.registerToUpdate.state) {
      let msj: alert = {
        icon: 'fa-regular fa-circle-question',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos de la caja ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.update()
    }
  }

  clean() {
    this.newRegister.get('name')?.setValue('');
  }
  update() {
    this.cajasSvc.updateRegister(Number(this.registerToUpdate.id_register),
      this.newRegister.value).subscribe(this.responseServer)
  }

  redirectToListRegisters() {
    this.routes.navigate(['/administracion/lista cajas'])
  }
  ngOnDestroy() {
    if (this.data != undefined)
      this.data.unsubscribe();
  }
}
