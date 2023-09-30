import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { category,alert } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private apiURL = 'http://localhost:3000/categories';
  constructor(private http: HttpClient) { }

  //accedo al backend para obtener datos de todas las categorias
  public getCategories(): Observable<category[]> {
    return this.http.get<category[]>(this.apiURL);
  }

  //accedo al backend para obtener datos de la categoria cuyo id se pasa como parametro
  public getCategory(id_Category: number): Observable<category[]|alert> {
    return this.http.get<category[]|alert>(this.apiURL + '/' + id_Category);
  }

  //accedo al backend para crear una nueva categoria
  public setCategory(Category: category): Observable<alert> {
    return this.http.post<alert>(this.apiURL, Category)
  }

  //accedo al backend para actualizar datos de la categoria cuyo id se pasa como parametro
  public updateCategory(id_Category: number, Category: category): Observable<alert> {
    return this.http.put<alert>(this.apiURL + '/' + id_Category, Category)
  }

   //accedo al backend para eliminar la categoria cuyo id se pasa como parametro
  public deleteCategory(id_Category: number): Observable<alert> {
    return this.http.delete<alert>(this.apiURL + '/' + id_Category)
  }
}
