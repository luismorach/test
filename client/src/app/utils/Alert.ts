import { ElementRef, Renderer2 } from "@angular/core"
import { FormGroup } from "@angular/forms";
import { alert } from 'src/app/interfaces/interfaces';

export class Alert {
  protected popUp?: ElementRef | undefined;
  protected renderer!: Renderer2;
  //constructor(protected renderer:Renderer2){}

  changeModal(values: alert) {
    let clase = ''
    if (values.title.includes('Estás')) {
      clase = ' question'
    }else if(values.title.includes('error')){
      clase=' error';
    }else{
      clase=' success'
    }
    this.renderer.setProperty(this.popUp?.nativeElement.children[0], 'className', values.icon+clase)
    this.renderer.setProperty(this.popUp?.nativeElement.children[1], 'textContent', values.title)
    this.renderer.setProperty(this.popUp?.nativeElement.children[2], 'textContent', values.content)
  }

  openModal(form: FormGroup) {
    if (form.valid) {
      let values = {
        icon: 'fa-regular fa-circle-question',
        title: '¿Estás seguro?',
        content: 'Los datos seran ingresados al sistema'
      }
      this.changeModal(values)
      this.popUp?.nativeElement.showModal()
    }
  }
  openModalToDelete() {
    let values = {
      icon: 'fa-regular fa-circle-question',
      title: '¿Estás seguro?',
      content: 'Los datos seran eliminados del sistema'
    }
    this.changeModal(values)
    this.popUp?.nativeElement.showModal()
  }
  cancel(element: ElementRef | undefined) {
    element?.nativeElement.close();
  }
}