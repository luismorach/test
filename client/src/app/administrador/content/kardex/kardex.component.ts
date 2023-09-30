import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent {


  title:string[]=[];
  constructor(private comunicatorSvc:ComunicatorComponetsService,private routes:Router) {}
  ngOnInit(){
    
    this.comunicatorSvc.getTitleComponent().pipe(tap(res=>this.title=res)).subscribe();
  }
}
