import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent extends DinamicComponent {
  title: string[] = [];
  data$?: Subscription;
  constructor(@Inject(DOCUMENT) document: any,private comunicatorSvc: ComunicatorComponetsService) {
    super(String(document.location.href).includes('nuevo'),
    String(document.location.href).includes('lista'))
  } 
  ngOnInit() {
    this.data$= this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
       this.title = titleComponet
       switch (titleComponet[1]) {
         case "NUEVO CLIENTE":
           this.option1 = true
           this.option2 = false
           break;
         case "LISTA CLIENTES":
           this.option1 = false
           this.option2 = true
           break;
         case "ACTUALIZAR CLIENTE":
           this.option1 = false
           this.option2 = false
           break;
       }
     })
   }
   ngOnDestroy() {
     this.data$?.unsubscribe();
   }
}
