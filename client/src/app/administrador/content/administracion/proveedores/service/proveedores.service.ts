import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { provider,alert } from 'src/app/interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  
  private apiURL = 'http://localhost:3000/providers';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las proveedores
  public getProviders(): Observable<provider[]> {
    return this.http.get<provider[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la proveedor cuyo id se pasa como parametro
  public getProvider(id_provider: number): Observable<provider[]|alert> {
    return this.http.get<provider[]|alert>(this.apiURL + '/' + id_provider);
  }

  //accedo al backend para crear un nueva proveedor
  public setProvider(provider: provider): Observable<alert> {
    return this.http.post<alert>(this.apiURL, provider)
  }

  //accedo al backend para actualizar datos del proveedor cuyo id se pasa como parametro
  public updateProvider(id_provider: number, provider: provider): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_provider, provider)
  }

   //accedo al backend para eliminar el proveedor cuyo id se pasa como parametro
  public deleteProvider(id_provider: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_provider)
  }
  
}
