import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { buy,alert, buy_product } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  private apiURL = 'http://localhost:3000/buys';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getBuys(): Observable<buy[]> {
    return this.http.get<buy[]>(this.apiURL);
  }
  public getBuysBydate(initialDate:Date,endDate:Date): Observable<buy[]> {
    return this.http.get<buy[]>(this.apiURL+'/'+new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getBuy(id_buy: number): Observable<buy[]|alert> {
    return this.http.get<buy[]|alert>(this.apiURL + '/' + id_buy);
  }
  public getBuyByUser(names:string): Observable<buy[]|alert> {
    return this.http.get<buy[]|alert>(this.apiURL + 'byUser/' +names);
  }
  public getBuyByProvider(name:string): Observable<buy[]|alert> {
    return this.http.get<buy[]|alert>(this.apiURL + 'byProvider/' +name);
  }
  public getProductsBuy(id_buy: number): Observable<buy_product[]|alert> {
    return this.http.get<buy_product[]|alert>(this.apiURL + 'Products/' + id_buy);
  }
  public getProductBuy(id_buy: number,id_product:number): Observable<buy_product[]|alert> {
    return this.http.get<buy_product[]|alert>(this.apiURL + 'Product/' + id_buy+'/'+id_product);
  }

  //accedo al backend para crear una nueva caja
  public setBuy(buy: buy): Observable<alert> {
    return this.http.post<alert>(this.apiURL, buy)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateBuy(id_buy: number, buy: buy): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_buy, buy)
  }
  public updateProductsBuy(id_buy: number,id_product:number, buy_product: buy_product): Observable<alert> {
    return this.http.put<alert>(this.apiURL + 'Products/' + id_buy+'/'+id_product, buy_product)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteBuy(id_buy: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_buy)
  }
}
