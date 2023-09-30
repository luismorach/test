import { Injectable } from '@angular/core';
import { register } from 'src/app/interfaces/interfaces';
import { alert } from 'src/app/interfaces/interfaces';
import { Observable} from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  private apiURL = 'http://localhost:3000/registers';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getRegisters(): Observable<register[]> {
    return this.http.get<register[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getRegister(id_register: number): Observable<register[]|alert> {
    return this.http.get<register[]|alert>(this.apiURL + '/' + id_register);
  }

  //accedo al backend para crear una nueva caja
  public setRegister(register: register): Observable<alert> {
    return this.http.post<alert>(this.apiURL, register)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateRegister(id_register: number, register: register): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_register, register)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteRegister(id_register: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_register)
  }
}
