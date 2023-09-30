import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { repayment,alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DevolucionesService {

  private apiURL = 'http://localhost:3000/repayments';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getRepayments(): Observable<repayment[]> {
    return this.http.get<repayment[]>(this.apiURL);
  }
  public getRepaymentsBydate(initialDate:Date,endDate:Date): Observable<repayment[]> {
    return this.http.get<repayment[]>(this.apiURL+'/'+new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getRepayment(id_repayment: number): Observable<repayment[]|alert> {
    return this.http.get<repayment[]|alert>(this.apiURL + '/' + id_repayment);
  }
  public getRepaymentsBuy(id_buy: number): Observable<repayment[]|alert> {
    return this.http.get<repayment[]|alert>(this.apiURL + 'Buy/' + id_buy);
  }
  public getRepaymentsSell(id_sell: number): Observable<repayment[]|alert> {
    return this.http.get<repayment[]|alert>(this.apiURL + 'Sell/' + id_sell);
  }
  public getRepaymentByUser(names:string): Observable<repayment[]|alert> {
    return this.http.get<repayment[]|alert>(this.apiURL + 'ByUser/' +names);
  }
  public getRepaymentByType(names:string): Observable<repayment[]|alert> {
    return this.http.get<repayment[]|alert>(this.apiURL + 'ByType/' +names);
  }
 
    //accedo al backend para crear una nueva caja
  public setRepaymentBuy(repayment: repayment): Observable<alert> {
    return this.http.post<alert>(this.apiURL+'Buy', repayment)
  }
  public setRepaymentSell(repayment: repayment): Observable<alert> {
    return this.http.post<alert>(this.apiURL+'Sell', repayment)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateRepayment(id_repayment: number, repayment: repayment): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_repayment, repayment)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteRepayment(id_repayment: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_repayment)
  }
}





