import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-buscar-kardex',
  templateUrl: './buscar-kardex.component.html',
  styleUrls: ['./buscar-kardex.component.css']
})
export class BuscarKardexComponent extends DinamicInput{
  formSearchKardex!:FormGroup;
  constructor(private fb: FormBuilder,private comunicatorSvc: ComunicatorComponetsService,
    private routes: Router) {
    super();
  }

  ngOnInit() {

    let title: string[] = [];
    let ruta;
    setTimeout(() => {
      /* Obtengo la ruta actual y la transformo para obtener el titulo del componente*/
      ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2);
      title.push("fas fa-search fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.formSearchKardex=this.fb.group({
      initialDate:new FormControl('',[Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      endDate:new FormControl('',[Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      campSearch:new FormControl('',[Validators.required,Validators.pattern(/^[0-9]+$/)])
    })
    
  }
  verificarFechas() {
    let result = { isValid: false, msj: '' }
    if(this.formSearchKardex.get('initialDate')?.invalid){
      result = { isValid: false, msj: 'La fecha inicial es invalida'}
    }else if( this.formSearchKardex.get('endDate')?.invalid ){
      result = { isValid: false, msj: 'La fecha final es invalida'}
    }else if(this.formSearchKardex.get('endDate')?.value<=this.formSearchKardex.get('initialDate')?.value){
      result = { isValid: false, msj: 'La fecha final debe ser mayor a la inicial'}
    }else{
      result = { isValid: true, msj: ''}
    }
   return result
  }

  redirectToKardexByDate() {
    this.routes.navigate(['/kardex/kardex general'],
      {
        queryParams: {
          initialDate: this.formSearchKardex.get('initialDate')?.value,
          endDate: this.formSearchKardex.get('endDate')?.value,
        }
      })
  }

  redirectToKardexByCriterio() {
    this.routes.navigate(['/kardex/kardex general'],
      {
        queryParams: {
          barcode:this.formSearchKardex.get('campSearch')?.value
        }
      })
  }
}
