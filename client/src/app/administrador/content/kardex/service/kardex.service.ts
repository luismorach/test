import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { kardex } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class KardexService {
  private apiURL = 'http://localhost:3000/kardex';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getKardex(): Observable<kardex[]> {
    return this.http.get<kardex[]>(this.apiURL);
  }
  public getKardexById(type:string,id_operation:number,id_product:number): Observable<kardex[]> {
    return this.http.get<kardex[]>(this.apiURL+'/'+type+'/'+id_operation+'/'+id_product);
  }
  public getKardexByDate(initialDate:Date,endDate:Date): Observable<kardex[]> {
    return this.http.get<kardex[]>(this.apiURL+'ByDate/'+
    new Intl.DateTimeFormat('es-CL').format(initialDate)+'/'+
    new Intl.DateTimeFormat('es-CL').format(endDate));
  }
  public getKardexByProduct(barcode:number): Observable<kardex[]> {
    return this.http.get<kardex[]>(this.apiURL+'ByProduct/'+barcode);
  }
}
