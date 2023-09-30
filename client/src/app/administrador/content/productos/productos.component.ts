import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
  title:string[]=[];
  constructor(private comunicatorSvc:ComunicatorComponetsService,private routes:Router) {}
  ngOnInit(){
    
    this.comunicatorSvc.getTitleComponent().pipe(tap(res=>this.title=res)).subscribe();
  }
}

