
export class DinamicComponent {
  option1: boolean;
  option2: boolean;
  
   constructor(param1: boolean, param2: boolean) {
    this.option1 = param1;
    this.option2 = param2;
  } 
  //constructor(){}
  
  selected(param1: boolean, param2: boolean) {
    this.option1 = param1;
    this.option2 = param2;
  }
  selectedClass(param: boolean) {
    let selectedClass = {
      'sub-option-active': param,
      'sub-option': !param
    };
    return selectedClass;
  }
  
}