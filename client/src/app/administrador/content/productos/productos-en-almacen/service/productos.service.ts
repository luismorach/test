import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { product,alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiURL = 'http://localhost:3000/products';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getProductos(): Observable<product[]> {
    return this.http.get<product[]>(this.apiURL);
  }
  public getProductosMasVendidos(): Observable<product[]> {
    return this.http.get<product[]>(this.apiURL+'/sells');
  }
  public getProductosPorVencimiento(): Observable<product[]> {
    return this.http.get<product[]>(this.apiURL+'/expir');
  }

  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getProducto(id_product: number): Observable<product[]|alert> {
    return this.http.get<product[]|alert>(this.apiURL + '/' + id_product);
  }
  public getProductoByBarcode(barcode: string): Observable<product[]|alert> {
    return this.http.get<product[]|alert>(this.apiURL + '/barcode/' + barcode);
  }
  public getProductoByCategory(id_category: number): Observable<product[]|alert> {
    return this.http.get<product[]|alert>(this.apiURL + '/category/' + id_category);
  }

  //accedo al backend para crear una nueva caja
  public setProducto(product: product): Observable<alert> {
    return this.http.post<alert>(this.apiURL, product)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateProducto(id_product: number, product: product): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_product, product)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteProducto(id_product: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_product)
  }
}
