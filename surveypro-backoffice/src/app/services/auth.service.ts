import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../types';
import { environment } from '../enviroments/environment';  
import { HttpHeaders } from '@angular/common/http';
import { isBrowser } from '../utils/storage.utils'; 

@Injectable({providedIn: 'root'})
export class AuthService {

    private apiUrl = environment.apiUrl; 
    constructor(private http: HttpClient) {}

    getToken(): string | null {
      if(isBrowser()){
          return localStorage.getItem("token")
      }
      return null;
    }



  getHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
  
    return headers;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
    // Login avec vérification type Admin
    login(email: string, password: string) {
        return this.http.post<{ access_token: string , admin: Admin }>(
          `${this.apiUrl}admin/login`,
          { email, password }
        );
      }

}


