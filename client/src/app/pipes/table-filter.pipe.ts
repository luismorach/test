import { Pipe, PipeTransform } from '@angular/core';
import { ComunicatorComponetsService } from '../services/comunicator/comunicator-componets.service';

@Pipe({
  name: 'tableFilter'
})
export class TableFilterPipe implements PipeTransform {
  constructor(private comunicatorSvc: ComunicatorComponetsService) { }

  transform(value: any, args: any): any {
    let result = [];
    for (let newValue of value) {
      if (args.search === null || args.search === '') {
        result.push(newValue)
      } else if (newValue[args.campSearch].indexOf(args.search) > -1) {
        result.push(newValue)
      }
    }
    if (args.pagination) {
      this.comunicatorSvc.setData(result);
      const inicio: number = args.indexCurrentPage * args.numberRows;
      const fin: number = inicio + args.numberRows;
      result = result.slice(inicio, fin);
    }
    return result
  }
}

