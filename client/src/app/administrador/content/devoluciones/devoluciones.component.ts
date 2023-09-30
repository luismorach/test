import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-devoluciones',
  templateUrl: './devoluciones.component.html',
  styleUrls: ['./devoluciones.component.css']
})
export class DevolucionesComponent {

  title:string[]=[];
  constructor(private comunicatorSvc:ComunicatorComponetsService,private routes:Router) {}
  ngOnInit(){
    
    this.comunicatorSvc.getTitleComponent().pipe(tap(res=>this.title=res)).subscribe();
  }
}
