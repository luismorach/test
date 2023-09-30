import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  title:string[]=[];
  constructor(private comunicatorSvc:ComunicatorComponetsService,private routes:Router) {}
  ngOnInit(){
    
    this.comunicatorSvc.getTitleComponent().pipe(tap(res=>this.title=res)).subscribe();
  }
}
