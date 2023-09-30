import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent extends DinamicComponent{
  title: string[] = []

  constructor(@Inject(DOCUMENT) document: any,
  private comunicatorSvc:ComunicatorComponetsService) {
    super(String(document.location.href).includes('nuevo'),
    String(document.location.href).includes('lista'))
  } 
  ngOnInit() {
    this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
      this.title = titleComponet
      switch (titleComponet[1]) {
        case "NUEVO PROVEEDOR":
          this.option1 = true
          this.option2 = false
          break;
        case "LISTA PROVEEDORES":
          this.option1 = false
          this.option2 = true
          break;
        case "ACTUALIZAR PROVEEDOR":
          this.option1 = false
          this.option2 = false
          break;
      }
    })
  }
}

