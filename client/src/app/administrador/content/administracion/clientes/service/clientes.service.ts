import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { client,alert } from 'src/app/interfaces/interfaces';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiURL = 'http://localhost:3000/clients';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las categorias
  public getClients(): Observable<client[]> {
    return this.http.get<client[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la categoria cuyo id se pasa como parametro
  public getClient(id_client: number): Observable<client[]|alert> {
    return this.http.get<client[]|alert>(this.apiURL + '/' + id_client);
  }

  //accedo al backend para crear una nueva categoria
  public setClient(client: client): Observable<alert> {
    return this.http.post<alert>(this.apiURL, client)
  }

  //accedo al backend para actualizar datos de la categoria cuyo id se pasa como parametro
  public updateClient(id_client: number, client: client): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_client, client)
  }

   //accedo al backend para eliminar la categoria cuyo id se pasa como parametro
  public deleteClient(id_client: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_client)
  }
}
