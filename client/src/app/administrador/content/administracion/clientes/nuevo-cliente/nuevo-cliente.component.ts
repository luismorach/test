import { Component, ElementRef, EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { client,alert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { ClientesService } from '../service/clientes.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent extends DinamicInput{
 
  formNewClient!: FormGroup;
  usedClass: string[] = [];
  title!: string[];
  ruta!: string;
  id_client!: number;
  clienteToUpdate!: client

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;
  @Output() messageEvent = new EventEmitter<client>();
  constructor(private fb: FormBuilder,
    public routes: Router,
    private comunicatorSvc$: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private clientesSvc: ClientesService,
    protected override renderer: Renderer2) {
    super();
   }

  ngOnInit() {
    setTimeout(() => {
      this.usedClass[0] = "input-on-focus";
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      this.title = []
      if (this.ruta.includes("nuevo")) {
        this.title.push("fa fa-child fa-fw");//añado el icono del titulo al array
      } else if (this.ruta.includes("actualizar")) {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }else{
        this.title.push("fas fa-cart-plus fa-fw");//aañado el icono del titulo al array
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc$.setTitleComponent(this.title);
    });
    if (this.routes.url.includes("actualizar")) {
      this.route.paramMap.subscribe({
        next: (params: ParamMap) => {
          this.id_client = Number(params.get('id_client'));
          this.clientesSvc.getClient(this.id_client).subscribe({
            next: res => {
              if (res instanceof Array) {
                this.formNewClient.get('document_type_client')?.setValue(res[0].document_type_client)
                this.formNewClient.get('document_number_client')?.setValue(res[0].document_number_client)
                this.formNewClient.get('names_client')?.setValue(res[0].names_client)
                this.formNewClient.get('last_names_client')?.setValue(res[0].last_names_client)
                this.formNewClient.get('state_client')?.setValue(res[0].state_client)
                this.formNewClient.get('city_client')?.setValue(res[0].city_client)
                this.formNewClient.get('street_client')?.setValue(res[0].street_client)
                this.formNewClient.get('phone_number_client')?.setValue(res[0].phone_number_client)
                this.formNewClient.get('email_client')?.setValue(res[0].email_client)
                this.clienteToUpdate = res[0]
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
      });
    }
    this.formNewClient = this.fb.group({
      id_client:new FormControl(0),
      document_type_client:new FormControl('Habilitado'),
      document_number_client: new FormControl('',[Validators.required,Validators.pattern(/^[0-9]+$/)]),
      names_client: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z ]+$/)]),
      last_names_client: new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z ]+$/)]),
      state_client: new FormControl('',[Validators.pattern(/^[a-zA-Z ]+$/)]),
      city_client: new FormControl('',[Validators.pattern(/^[a-zA-Z ]+$/)]),
      street_client: new FormControl('',[Validators.pattern(/^[a-zA-Z ]+$/)]),
      phone_number_client: new FormControl('',[Validators.pattern(/^[0-9]+$/)]),
      email_client: new FormControl('',[Validators.email]),
    })
  }

  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc$.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  submit() {
    console.log(this.formNewClient.value)
    this.clientesSvc.setClient(this.formNewClient.value).subscribe({
      next: res => {
        let aux:any=res
        console.log(res)
        this.changeModal(res);
        this.popUp?.nativeElement.showModal()
        this.formNewClient.get('id_client')?.setValue(aux.id_client)
      },
      error: (error: HttpErrorResponse) => {
        this.error(error)
      }
    })
  }
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListClientes();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizado') &&
      this.ruta.includes("actualizar")) {
      this.redirectToListClientes();
    }else if(this.popUp?.nativeElement.children[1].textContent.includes('Registrado')){
      let client:client=this.formNewClient.value
      this.messageEvent.emit(client);
    }
  }

  update() {
    this.clientesSvc.updateClient(Number(this.id_client),
      this.formNewClient.value).subscribe({
        next: res => {
          this.changeModal(res);
          this.popUp?.nativeElement.showModal();
        },
        error: (error: HttpErrorResponse) => {
          this.error(error);
        }
      })
  }
  validarUpdate() {
    if (this.formNewClient.get('document_type_client')?.value === this.clienteToUpdate.document_type_client &&
      this.formNewClient.get('document_number_client')?.value === this.clienteToUpdate.document_number_client &&
      this.formNewClient.get('names_client')?.value === this.clienteToUpdate.names_client &&
      this.formNewClient.get('last_names_client')?.value === this.clienteToUpdate.last_names_client &&
      this.formNewClient.get('state_client')?.value === this.clienteToUpdate.state_client &&
      this.formNewClient.get('city_client')?.value === this.clienteToUpdate.city_client &&
      this.formNewClient.get('street_client')?.value === this.clienteToUpdate.street_client &&
      this.formNewClient.get('phone_number_client')?.value === this.clienteToUpdate.phone_number_client &&
      this.formNewClient.get('email_client')?.value === this.clienteToUpdate.email_client) {
      let msj: alert = {
        icon: '',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos del usuario ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.update()
    }
  }


  redirectToListClientes() {
    this.routes.navigate(['/administracion/lista clientes'])
  }
  clean(){
    this.formNewClient.get('document_number_client')?.setValue('');
    this.formNewClient.get('names_client')?.setValue('');
    this.formNewClient.get('lastNames_client')?.setValue('');
    this.formNewClient.get('state_client')?.setValue('');
    this.formNewClient.get('city_client')?.setValue('');
    this.formNewClient.get('street_client')?.setValue('');
    this.formNewClient.get('phone_number_client')?.setValue('');
    this.formNewClient.get('email_client')?.setValue('');
  }
}
