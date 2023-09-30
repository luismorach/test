import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { alert, sell_product, sell,user,client, pay } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiURL = 'http://localhost:3000/sells';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getSells(): Observable<sell[]> {
    return this.http.get<sell[]>(this.apiURL);
  }
  public getSellsBydate(initialDate:Date,endDate:Date): Observable<sell[]|user[]|client[]> {
    return this.http.get<sell[]|user[]|client[]>(this.apiURL+'/'+new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }
  public getSellBydate(initialDate:Date,endDate:Date): Observable<sell[]|user[]|client[]> {
    return this.http.get<sell[]|user[]|client[]>(this.apiURL+'ByDate/'+
    new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }
  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getSell(id_Sell: number): Observable<sell[]|user[]|client[]> {
    return this.http.get<sell[]|user[]|client[]>(this.apiURL + '/' + id_Sell);
  }
  public getSellByUser(names:string): Observable<sell[]|alert> {
    return this.http.get<sell[]|alert>(this.apiURL + 'byUser/' +names);
  }
  public getSellByClient(names:string): Observable<sell[]|alert> {
    return this.http.get<sell[]|alert>(this.apiURL + 'byClient/' +names);
  }
  
  public getProductsSell(id_Sell: number): Observable<sell_product[]|alert> {
    return this.http.get<sell_product[]|alert>(this.apiURL + 'Products/' + id_Sell);
  }
  public getProductSell(id_Sell: number,id_product:number): Observable<sell_product[]|alert> {
    return this.http.get<sell_product[]|alert>(this.apiURL + 'Product/' + id_Sell+'/'+id_product);
  }
  public getPaysSell(id_Sell: number): Observable<pay[]|alert> {
    return this.http.get<pay[]|alert>(this.apiURL + 'Pays/' + id_Sell);
  }
  public getPaysByDate(initialDate:Date,endDate:Date): Observable<pay[]|alert> {
    return this.http.get<pay[]|alert>(this.apiURL + 'PaysByDate/' + 
    new Intl.DateTimeFormat('es-CL').format(initialDate)
    +'/'+new Intl.DateTimeFormat('es-CL').format(endDate));
  }

  //accedo al backend para crear una nueva caja
  public setSell(Sell: sell): Observable<alert> {
    return this.http.post<alert>(this.apiURL, Sell)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateSell(id_Sell: number, Sell: sell): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_Sell, Sell)
  }
  public updateProductsSell(id_Sell: number,id_product:number, Sell_product: sell_product): Observable<alert> {
    return this.http.put<alert>(this.apiURL + 'Products/' + id_Sell+'/'+id_product, Sell_product)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteSell(id_Sell: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_Sell)
  }
}
