import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiResponse, EnqueteData } from '../types';
import { AuthService } from './auth.service';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnqueteService {
  private apiUrl = environment.apiUrl;

  // BehaviorSubject pour partager les enquêtes entre composants
  private enqueteSubject = new BehaviorSubject<EnqueteData[]>([]);
  public enquetes$ = this.enqueteSubject.asObservable(); // observable pour s'abonner

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Mettre à jour les enquêtes dans le BehaviorSubject
  setEnquetes(data: EnqueteData[]) {
    this.enqueteSubject.next(data);
  }

  // Récupérer toutes les enquêtes
  getEnquetes(): Observable<EnqueteData[]> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.get<EnqueteData[]>(`${this.apiUrl}enquetes`, {
      headers,
      withCredentials: true
    });
  }

  // Récupérer une enquête par son ID
  getEnqueteById(id: string): Observable<ApiResponse<EnqueteData>> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.get<ApiResponse<EnqueteData>>(`${this.apiUrl}enquetes/${id}`, {
      headers,
      withCredentials: true
    });
  }
   // Récupérer une enquête par son ID
   getEnqueteResponseById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}responses/${id}`);
  }

     // Récupérer une enquête par son ID
     getEnqueteResponses(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}responses`);
    }
  

  // Créer une nouvelle enquête
  createEnquete(enquete: EnqueteData): Observable<EnqueteData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.post<EnqueteData>(`${this.apiUrl}enquetes/auth/create`, enquete, {
      headers,
      withCredentials: true
    });
  }

  // Mettre à jour une enquête existante
  updateEnquete(id_enquete: string, enquete: EnqueteData): Observable<EnqueteData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.patch<EnqueteData>(`${this.apiUrl}enquetes/auth/edit/enquete/${id_enquete}`, enquete, {
      headers,
      withCredentials: true
    });
  }

  // Supprimer une enquête
  deleteEnquete(id_enquete: string): Observable<ApiResponse<EnqueteData>> {
    console.log(id_enquete)
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.delete<ApiResponse<EnqueteData>>(`${this.apiUrl}enquetes/auth/delete/${id_enquete}`, {
      headers,
      withCredentials: true
    });
  }

  // Changer le status d'une enquête
  changeStatusEnquete(id: string, status: string): Observable<EnqueteData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.patch<EnqueteData>(`${this.apiUrl}enquetes/auth/edit_status/${id}`, { status }, {
      headers,
      withCredentials: true
    });
  }
}
