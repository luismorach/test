import { ElementRef, Renderer2, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Alert } from "src/app/utils/Alert";

export class DinamicTable extends Alert {
  numberPages: number = 0;
  currentPage?: any;
  indexCurrentPage: number = 0
  numberRows: number = 0
  protected pagination?: ElementRef | undefined;
  protected next?: ElementRef | undefined;
  protected info?: ElementRef | undefined;
  constructor(protected override renderer: Renderer2) {
    super()
  }

  deleteChildren() {
    let nodes = this.pagination?.nativeElement.childNodes;
    if (nodes.length > 2) {
      for (let index = 1; index < nodes.length - 1;) {
        this.renderer.removeChild(this.pagination?.nativeElement,
          this.pagination?.nativeElement.children[1])
      }
    }
  }

  AddDeleteStyles(classOne: string, classTwo: string) {
    this.renderer.removeClass(this.currentPage, classOne)
    this.renderer.addClass(this.currentPage, classTwo)
  }
  changePage(child: any, form: FormGroup, currentData: any[], allData: any[]) {
    this.AddDeleteStyles('selected', 'items')
    this.currentPage = child;
    this.indexCurrentPage = Number(child.value)
    this.AddDeleteStyles('items', 'selected')
    this.getInfo(form, currentData, allData);
    this.createPages(form, currentData, allData)
  }
  
  addEventToChild(child: any, form: FormGroup, currentData: any[], allData: any[], i: number) {
    let value = this.renderer.createText((i + 1).toString())
    this.renderer.setProperty(child, 'value', i)
    this.renderer.listen(child, 'click', (event) => {
      this.changePage(child, form, currentData, allData);
    })
    switch (this.indexCurrentPage) {
      case this.numberPages:
        this.indexCurrentPage = this.numberPages - 1
        break;
      case i:
        this.renderer.addClass(child, 'selected')
        this.currentPage = child;
        break;
      default:
        this.renderer.addClass(child, 'items')
        break;
    }

    return value;
  }
  createPages(form: FormGroup, currentData: any[], allData: any[]) {
    if (this.numberRows != form.get('numberRows')?.value)
      this.indexCurrentPage = 0;
    this.numberRows = form.get('numberRows')?.value
    this.deleteChildren(); //elimino todas las paginas actuales
    this.numberPages = Math.trunc((currentData.length - 1) / this.numberRows) + 1
    //itero sobre el numero de paginas a crear
    for (let i = 0; i < ((this.numberPages > 7) ? 7 : this.numberPages); i++) {
      const child = this.renderer.createElement('li')//creo la pagina
      let value;
      if (this.numberPages <=7) {
        value = this.addEventToChild(child, form, currentData, allData, i)
      } else {
        switch (i) {
          case 0:
            value = this.addEventToChild(child, form, currentData, allData, i)
            break;
          case 1:
            if (this.indexCurrentPage >= 4) {
              value = this.renderer.createText(('...').toString())
            } else {
              value = this.addEventToChild(child, form, currentData, allData, i)
            }
            break;
          case 5:
            if (this.numberPages - this.indexCurrentPage > 4) {
              value = this.renderer.createText(('...').toString())
            } else {
              value = this.addEventToChild(child, form, currentData, allData, this.numberPages - 2)
            }
            break;
          case 6:
            value = this.addEventToChild(child, form, currentData, allData, this.numberPages - 1)
            break;
          default:
            if (this.indexCurrentPage >= 4 && this.numberPages-this.indexCurrentPage>3) {
              value = this.addEventToChild(child, form, currentData, allData, this.indexCurrentPage-3+i)
            }else if(this.numberPages - this.indexCurrentPage < 4){
              value = this.addEventToChild(child, form, currentData, allData, this.numberPages-7+i)
            } else {
              value = this.addEventToChild(child, form, currentData, allData, i)

            }
            break;
        }

      }
      
      this.renderer.addClass(child, 'dataTables_info')//
      this.renderer.addClass(child, 'page-item')//añado las clases alos elementos
      this.renderer.addClass(child, 'active')//
      this.renderer.appendChild(child, value)//le agrego el texto al elemento
      this.renderer.insertBefore(this.pagination?.nativeElement,
        child, this.next?.nativeElement)//inserto el elento en la vista

      this.getInfo(form, currentData, allData);
      
    }
  }

  getInfo(form: FormGroup, currentData: any[], allData: any[]) {
    let msj: string = 'mostrando ';
    let nodes = this.info?.nativeElement.childNodes;
    let inicio = Number(this.currentPage.value) *
      Number(form.get('numberRows')?.value) + 1
    let fin = inicio +
      Number(form.get('numberRows')?.value) - 1
    for (let index = 0; index < nodes.length;) {
      this.renderer.removeChild(this.info?.nativeElement,
        this.info?.nativeElement.children[0])
    }
    if (currentData.length < fin) {
      if (form.get("search")?.value !== '' &&
        form.get("search")?.value !== null) {
        msj = msj.concat('del ', String(inicio),
          ' al ', String(currentData.length), " de ",
          String(currentData.length), " entradas ",
          " (filtradas de ", String(allData.length), " en total)")
      } else {
        msj = msj.concat('del ', String(inicio),
          ' al ', String(allData.length), " de ",
          String(allData.length), " entradas")
      }

    } else {
      if (form.get("search")?.value !== ''
        && form.get("search")?.value !== null) {
        msj = msj.concat('del ', String(inicio),
          ' al ', String(fin), ' de ',
          String(currentData.length), " entradas",
          " (filtradas de ", String(allData.length), " en total)")
      } else {
        msj = msj.concat('del ', String(inicio),
          ' al ', String(fin), ' de ',
          String(allData.length), " entradas")
      }
    }
    const child = this.renderer.createElement('p')
    const text = this.renderer.createText(msj)
    this.renderer.appendChild(child, text)
    this.renderer.addClass(child, 'dataTables_info')
    this.renderer.appendChild(this.info?.nativeElement, child)
  }

  getValuesToPipe(form: FormGroup): any {
    let argsPipe = {
      search: form.get('search')?.value,
      campSearch:form.get('campSearch')?.value,
      indexCurrentPage: (this.currentPage === undefined) ?
        0 : Number(this.currentPage.value),
      numberRows: Number(form.get('numberRows')?.value),
      pagination:true
    }
    return argsPipe;
  }
  nextPage(form: FormGroup, currentData: any[], allData: any[]) {
    let nodes = this.pagination?.nativeElement.children;
    for(let i=0;i<nodes.length;i++){
      if(nodes[i].value===this.currentPage.value+1){
        this.changePage(nodes[i],
          form, currentData, allData);
        break;
      }
    }
  }
  previousPage(form: FormGroup, currentData: any[], allData: any[]) {
    let nodes = this.pagination?.nativeElement.children;
    for(let i=1;i<nodes.length;i++){
      if(nodes[i].value===this.currentPage.value-1){
        this.changePage(nodes[i],
          form, currentData, allData);
        break;
      }
    }
  }
}