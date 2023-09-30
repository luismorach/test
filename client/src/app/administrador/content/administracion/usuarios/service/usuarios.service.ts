import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { user,alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private apiURL = 'http://localhost:3000/users';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las proveedores
  public getUsers(): Observable<user[]> {
    return this.http.get<user[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la proveedor cuyo id se pasa como parametro
  public getUser(id_User: number): Observable<user[]|alert> {
    return this.http.get<user[]|alert>(this.apiURL + '/' + id_User);
  }

  //accedo al backend para crear un nueva proveedor
  public setUser(User: user): Observable<alert> {
    return this.http.post<alert>(this.apiURL, User)
  }

  //accedo al backend para actualizar datos del proveedor cuyo id se pasa como parametro
  public updateUser(id_User: number, User: user): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_User, User)
  }

   //accedo al backend para eliminar el proveedor cuyo id se pasa como parametro
  public deleteUser(id_user: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_user)
  }
  
}
