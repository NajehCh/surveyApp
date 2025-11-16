import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiResponse, EmailData, EnqueteData, SendEmailData } from '../types';
import { AuthService } from './auth.service';
import { environment } from '../enviroments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Mettre à jour les enquêtes dans le BehaviorSubject
  setEmail(email: EmailData[]) {
  }

  // Récupérer toutes les emails
  getEmail(): Observable<EmailData[]> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.get<EmailData[]>(`${this.apiUrl}emails`, {
      headers,
      withCredentials: true
    });
  }


  // Créer une nouvelle enquête
  createEmail(email: { email: string }): Observable<EmailData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.post<EmailData>(`${this.apiUrl}emails`, email, {
      headers,
      withCredentials: true
    });
  }

  // Mettre à jour une enquête existante
  updateEmail(id_email:string,email: { email: string }): Observable<EmailData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.patch<EmailData>(`${this.apiUrl}emails/${id_email}`, email, {
      headers,
      withCredentials: true
    });
  }

  // Supprimer une enquête
  deleteEmail(id_email: string): Observable<EmailData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.delete<EmailData>(`${this.apiUrl}emails/${id_email}`, {
      headers,
      withCredentials: true
    });
  }

  sendEmail(sendEmail:SendEmailData): Observable<SendEmailData> {
    const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.post<SendEmailData>(`${this.apiUrl}emails/send-email`, sendEmail, {
      headers,
      withCredentials: true
    });
  }

}
