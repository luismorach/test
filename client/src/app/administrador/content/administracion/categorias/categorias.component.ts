import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html'
})
export class CategoriasComponent extends DinamicComponent {
  title: string[] = []

  constructor(@Inject(DOCUMENT) document: any, private comunicatorSvc: ComunicatorComponetsService) {
    super(String(document.location.href).includes('nueva'),
      String(document.location.href).includes('lista'))
  }

  ngOnInit() {
    this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
      this.title = titleComponet
      switch (titleComponet[1]) {
        case "NUEVA CATEGORÍA":
          this.option1 = true
          this.option2 = false
          break;
        case "LISTA CATEGORÍAS":
          this.option1 = false
          this.option2 = true
          break;
        case "ACTUALIZAR CATEGORÍA":
          this.option1 = false
          this.option2 = false
          break;
      }
    })
  }
}
