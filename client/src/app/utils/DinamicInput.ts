import { FormGroup } from "@angular/forms";
import { Alert } from 'src/app/utils/Alert';

export class DinamicInput extends Alert{

  elementHasFocus: boolean[] = [];
  positionLabel: boolean[] = [];
  form!: FormGroup
  input!: string
  constructor(){
    super();
  }

  isFocused(index: number, form: FormGroup, input: string) {
    this.form=form
    this.input=input
    this.elementHasFocus[index] = !this.elementHasFocus[index];
    this.positionLabel[index] = form.get(input)?.value
      ? false : true

  }
  /*mueve la etiqueta hacia arriba y la letra la vuelve mas pequeña si el  input esta vacio,
  ademas cambia de color la etiqueta a rojo o verde si la entrada del input es correcta. 
  si el campo no esta vacio solo cambia el color de la etiqueta*/
  animationLabel(form: FormGroup, input: string,) {
    type property={[key:string]:string}
    const styles:property={    };
    if (form.get(input)?.value || input === 'select') {
      styles["top"]= "0";
      styles["font-size"]= "1rem";
    
    } 
    if ((form.get(input)?.dirty || form.get(input)?.touched)&&form.get(input)?.errors) {
        if (form.get(input)?.errors) {
          styles["color"]="red"
          
        } else {
          styles["color"]= "#009688"
          
        }
    }
    return styles;
  }
  
  styleForeground(form: FormGroup, input: string,) {
    let styles!: object;

    if (form.get(input)?.dirty || form.get(input)?.touched) {
      if (form.get(input)?.errors) {
        styles = {
          "color": "red"
        }
      } 
    }
    return styles;
  }
  verifyStyleInput(form: FormGroup, input: string){
    let verify:Boolean=true;
    if (form.get(input)?.dirty || form.get(input)?.touched) {
      if (form.get(input)?.errors) {
        verify=false;
      }else{
        verify=true;
      } 
    }
    return verify;
  }
  validate(event: any, hasDecimal: boolean) {
    let key;
    let regex;

    if (event.type === 'paste') {
      key = event.clipboardData.getData('text/plain')
    } else {
      key = event.keyCode;
      key = String.fromCharCode(key)
    }

    if (hasDecimal) {
      regex = /[0-9]|\./;
    } else {
      regex = /[0-9]/;
    }
    if (!regex.test(key) || ((key === '.') && event.target.value.includes('.'))) {
      event.returnValue = false;
      if (event.preventDefault) {
        event.preventDefault()
      }
    }
  }
 
}