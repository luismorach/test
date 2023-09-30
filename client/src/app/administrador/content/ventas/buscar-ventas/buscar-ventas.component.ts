import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-buscar-ventas',
  templateUrl: './buscar-ventas.component.html',
  styleUrls: ['./buscar-ventas.component.css']
})
export class BuscarVentasComponent extends DinamicInput{
  formSearchSells!:FormGroup;
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
      title.push("fas fa-search-dollar fa-fw");//aañado el icono del titulo al array
      title.push(decodeURI(ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(title);
    })
    this.formSearchSells=this.fb.group({
      initialDate:new FormControl('',[Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      endDate:new FormControl('',[Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      campSearch:new FormControl('',[Validators.required,Validators.pattern(/^[a-zA-Z 0-9]+$/)])
    })
  }

  verificarFechas() {
    let result = { isValid: false, msj: '' }
    if(this.formSearchSells.get('initialDate')?.invalid){
      result = { isValid: false, msj: 'La fecha inicial es invalida'}
    }else if( this.formSearchSells.get('endDate')?.invalid ){
      result = { isValid: false, msj: 'La fecha final es invalida'}
    }else if(this.formSearchSells.get('endDate')?.value<=this.formSearchSells.get('initialDate')?.value){
      result = { isValid: false, msj: 'La fecha final debe ser mayor a la inicial'}
    }else{
      result = { isValid: true, msj: ''}
    }
   return result
  }

  redirectToVentasRealizadas() {
    this.routes.navigate(['/ventas/ventas realizadas'],
      {
        queryParams: {
          initialDate: this.formSearchSells.get('initialDate')?.value,
          endDate: this.formSearchSells.get('endDate')?.value,
        }
      })
  }

  redirectToVentasRealizadasByCriterio() {
    this.routes.navigate(['/ventas/ventas realizadas'],
      {
        queryParams: {
          criterio:this.formSearchSells.get('campSearch')?.value
        }
      })
  }

}
