import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { user, alert, register } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuariosService } from '../service/usuarios.service';
import { CajasService } from '../../cajas/service/cajas.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent extends DinamicInput {
  formNewUser!: FormGroup;
  usedClass: string[] = [];
  title!: string[];
  ruta!: string;
  id_user!: number;
  userToUpdate!: user
  
  registers!: register[]
  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder,
    public routes: Router,
    private comunicatorSvc$: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private usersSvc: UsuariosService,
    private cajasSvc: CajasService,
    protected override renderer: Renderer2) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.usedClass[0] = "input-on-focus";
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      this.title = []
      if (this.ruta.includes("nuevo") || this.ruta.includes("cuenta")) {
        this.title.push((this.ruta.indexOf("nuevo")) ? "fas fa-user-cog fa-fw" : "fa fa-user-tie fa-fw");//añado el icono del titulo al array
      } else {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc$.setTitleComponent(this.title);
    });
    if (this.routes.url.includes("actualizar")) {
      this.route.paramMap.subscribe({
        next: (params: ParamMap) => {
          this.id_user = Number(params.get('id_user'));
          this.usersSvc.getUser(this.id_user).subscribe({
            next: res => {
              if (res instanceof Array) {
                this.formNewUser.get('document_type_user')?.setValue(res[0].document_type_user)
                this.formNewUser.get('document_number_user')?.setValue(res[0].document_number_user)
                this.formNewUser.get('names_user')?.setValue(res[0].names_user)
                this.formNewUser.get('last_names_user')?.setValue(res[0].last_names_user)
                this.formNewUser.get('range_user')?.setValue(res[0].range_user)
                this.formNewUser.get('state_user')?.setValue(res[0].state_user)
                this.formNewUser.get('gander_user')?.setValue(res[0].gander_user)
                this.formNewUser.get('phone_number_user')?.setValue(res[0].phone_number_user)
                this.formNewUser.get('email_user')?.setValue(res[0].email_user)
                this.formNewUser.get('password_user')?.setValue(res[0].password_user)
                this.formNewUser.get('repeat_password_user')?.setValue(res[0].password_user)
                this.userToUpdate = res[0]
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
   
    this.formNewUser = this.fb.group({
      document_type_user: new FormControl('V-'),
      document_number_user: new FormControl('', [Validators.required,
         Validators.pattern(/^[0-9]+$/),Validators.maxLength(10)]),
      names_user: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
      last_names_user: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
      range_user: new FormControl('Administrador'),
      phone_number_user: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]+$/)]),
      id_register: new FormControl(9),
      gander_user: new FormControl('Masculino'),
      state_user: new FormControl('Habilitada'),
      password_user: new FormControl('', [Validators.required]),
      repeat_password_user: new FormControl('', [Validators.required]),
      email_user: new FormControl('', [Validators.email]),
    })
    
    this.formNewUser.get('repeat_password_user')?.setValidators(
      [this.equalsValidator(this.formNewUser, 'password_user'), Validators.required])
    this.formNewUser.get('password_user')?.setValidators(
      [this.equalsValidator(this.formNewUser, 'repeat_password_user'), Validators.required])
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc$.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }
  changeRange(){
    if (this.formNewUser.get('range_user')?.value.includes('Cajero')) {
      this.cajasSvc.getRegisters().subscribe(res =>this.registers = res)
    }
  }
  submit() {
    console.log(this.formNewUser.value)
    this.usersSvc.setUser(this.formNewUser.value).subscribe({
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
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListUsers();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizado') &&
      this.ruta.includes("actualizar")) {
      this.redirectToListUsers();
    }
  }

  update() {
    this.usersSvc.updateUser(Number(this.id_user),
      this.formNewUser.value).subscribe({
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
    if (this.formNewUser.get('document_type_user')?.value === this.userToUpdate.document_type_user &&
      this.formNewUser.get('document_number_user')?.value === this.userToUpdate.document_number_user &&
      this.formNewUser.get('names_user')?.value === this.userToUpdate.names_user &&
      this.formNewUser.get('last_names_user')?.value === this.userToUpdate.last_names_user &&
      this.formNewUser.get('range_user')?.value === this.userToUpdate.range_user &&
      this.formNewUser.get('state_user')?.value === this.userToUpdate.state_user &&
      this.formNewUser.get('gander_user')?.value === this.userToUpdate.gander_user &&
      this.formNewUser.get('id_register')?.value === this.userToUpdate.id_register &&
      this.formNewUser.get('phone_number_user')?.value === this.userToUpdate.phone_number_user &&
      this.formNewUser.get('email_user')?.value === this.userToUpdate.email_user &&
      this.formNewUser.get('password_user')?.value === this.userToUpdate.password_user) {
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

  redirectToListUsers() {
    this.routes.navigate(['/administracion/lista usuarios'])
  }

  clean() {
    this.formNewUser.get('document_type')?.setValue('');
    this.formNewUser.get('document_number')?.setValue('');
    this.formNewUser.get('range')?.setValue('');
    this.formNewUser.get('names')?.setValue('');
    this.formNewUser.get('last_names')?.setValue('');
    this.formNewUser.get('state')?.setValue('Habilitado');
    this.formNewUser.get('phone_number')?.setValue('');
    this.formNewUser.get('email')?.setValue('');
    this.formNewUser.get('password')?.setValue('');
    this.formNewUser.get('repeatPassword')?.setValue('');
  }
  //Función que valida si las contraseñas ingresadas son iguales
  equalsValidator(otherControl: AbstractControl, equalCamp: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: any = control.value;
      const otherValue: any = otherControl.get(equalCamp)?.value;
      if (otherValue.length < 1)
        return null
      else {
        if (otherValue === value)
          otherControl.get(equalCamp)?.setErrors(null)
        return otherValue === value ? null : { 'notEquals': { value, otherValue } };
      }
    };
  }
}
