import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../enviroments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {

 private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient,private authService : AuthService) { }

  // Récupérer toutes les réponses
  getAllResponses(): Observable<any[]> {
   const headers: HttpHeaders = this.authService.getHeaders();
    return this.http.get<any[]>(`${this.apiUrl}responses`,{
     headers,withCredentials:true
    });
  }

}
