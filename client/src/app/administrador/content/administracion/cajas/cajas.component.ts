import { Component, Inject } from '@angular/core';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-cajas',
  templateUrl: './cajas.component.html'
})

export class CajasComponent extends DinamicComponent {
  title: string[] = []

  constructor(private comunicatorSvc: ComunicatorComponetsService) {
    super(true, false);
  }
  ngOnInit() {
    this.comunicatorSvc.getTitleComponent().subscribe(titleComponet => {
      this.title = titleComponet
      switch (titleComponet[1]) {
        case "NUEVA CAJA":
          this.option1 = true
          this.option2 = false
          break;
        case "LISTA CAJAS":
          this.option1 = false
          this.option2 = true
          break;
        case "ACTUALIZAR CAJA":
          this.option1 = false
          this.option2 = false
          break;
      }
    })
  }
}
