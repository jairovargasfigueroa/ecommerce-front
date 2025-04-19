import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  private defaultHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });


  constructor(private http: HttpClient) {}

  // Método para obtener los headers, incluyendo el token si está disponible
  


  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      headers: this.defaultHeaders,
      params : params
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, {
      headers: this.defaultHeaders,
    });
  }

  put<T>(endpoint: string, id: number, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}/`, body, {
      headers: this.defaultHeaders
    });
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}/`, {
      headers: this.defaultHeaders
    });
  }
}
