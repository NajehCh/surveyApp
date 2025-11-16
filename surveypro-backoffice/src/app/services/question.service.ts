import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, EnqueteData,QuestionData } from '../types';
import { environment } from '../enviroments/environment';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class  QuestionService {
    
    private apiUrl = environment.apiUrl;
    private enqueteSubject = new BehaviorSubject<EnqueteData[]>([]);
    public enquetes$ = this.enqueteSubject.asObservable();

    constructor(private http: HttpClient, private authService : AuthService) {
    }
    
   
    getQuestionsByEnquete(id_enquete: string): Observable<QuestionData[]> {
        const headers = this.authService.getHeaders(); 
        return   this.http.get<QuestionData[]>(`${this.apiUrl}questions/enquete/${id_enquete}`, { headers ,withCredentials: true });
    }



    deleteQuestion(id_question:string):Observable<QuestionData>{
      const headers = this.authService.getHeaders();
      return  this.http.delete<QuestionData>(`${this.apiUrl}questions/${id_question}`,{headers, withCredentials:true});
    }

    updateQuestion(id_question:string,data:QuestionData):Observable<QuestionData>{
      const headers = this.authService.getHeaders();
      return this.http.patch<QuestionData>(`${this.apiUrl}questions/${id_question}`,data,{headers, withCredentials:true})
    }
    createQuestion(data:QuestionData):Observable<QuestionData>{
      const headers = this.authService.getHeaders();
      return this.http.post<QuestionData>(`${this.apiUrl}questions/create`,data,{headers, withCredentials:true})
    }
    
    
}