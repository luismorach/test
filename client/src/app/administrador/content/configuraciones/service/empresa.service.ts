import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { building,alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private apiURL = 'http://localhost:3000/building';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las cajas
  public getBuildings(): Observable<building[]> {
    return this.http.get<building[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la caja cuyo id se pasa como parametro
  public getBuilding(id_building: number): Observable<building[]|alert> {
    return this.http.get<building[]|alert>(this.apiURL + '/' + id_building);
  }
  public getbuildingoByCategory(id_category: number): Observable<building[]|alert> {
    return this.http.get<building[]|alert>(this.apiURL + '/category/' + id_category);
  }

  //accedo al backend para crear una nueva caja
  public setBuilding(building: building): Observable<alert> {
    return this.http.post<alert>(this.apiURL, building)
  }

  //accedo al backend para actualizar datos de la caja cuyo id se pasa como parametro
  public updateBuilding(id_building: number, building: building): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_building, building)
  }

   //accedo al backend para eliminar la caja cuyo id se pasa como parametro
  public deleteBuilding(id_building: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_building)
  }
  
}
