import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent extends DinamicComponent {
  title: string[] = [];
  data$?: Subscription;
  constructor(@Inject(DOCUMENT) document: any, private comunicatorSvc: ComunicatorComponetsService) {
    super(String(document.location.href).includes('nuevo'),
      String(document.location.href).includes('lista'))
  }
  ngOnInit() {
   this.data$= this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
      this.title = titleComponet
      switch (titleComponet[1]) {
        case "NUEVO USUARIO":
          this.option1 = true
          this.option2 = false
          break;
        case "LISTA USUARIOS":
          this.option1 = false
          this.option2 = true
          break;
        case "ACTUALIZAR USUARIO":
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
