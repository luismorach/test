import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { coin } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComunicatorComponetsService {
  private listData$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private state$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private titleComponent$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor() { }

  public setshowHideNavBar(state: boolean) {
    this.state$.next(state);
  }

  public getShowHideNavBar(): Observable<boolean> {
    return this.state$.asObservable();
  }

  public setTitleComponent(title: any) {
    this.titleComponent$.next(title);
  }
  public getTitleComponent(): Observable<string[]> {
    return this.titleComponent$.asObservable();
  }

  public setData(data: any) {
    this.listData$.next(data)
  }
  public getData() {
    return this.listData$.asObservable();
  }
  public errorServer(error: HttpErrorResponse) {
    let content: string
    if (error.error instanceof Error) {
      content = 'Error cliente o red:' + error.error.message
    } else {
      content = 'Error en el servidor remoto:' + error.message
    }
    let values = {
      icon: 'fa-regular fa-circle-xmark',
      title: 'Ocurrió un error inesperado',
      content: content
    }

    return values
  }
  converterToMainCoin(value: number, exchange: number) {
    return Number((value * exchange).toFixed(2))
  }
  converterToSecondaryCoin(value: number, exchange: number) {
    return Number((value / exchange).toFixed(2))
  }
  converter(value: number, coin: coin) {
    let valueConverted = 0
    if (coin != undefined) {
      if (coin.type === 'principal') {
        valueConverted = Number((value * coin.exchange).toFixed(2))
      } else {
        valueConverted = Number((value / coin.exchange).toFixed(2))
      }
    }
    return valueConverted
  }

  currencyFormatter(value: number) {
    const formatter = new Intl.NumberFormat('es-VE', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: 'VES',
    })
    return formatter.format(value)
  }
}
