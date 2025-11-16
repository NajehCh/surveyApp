import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from '../enviroments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse, EnqueteData } from "../types";


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}

    getEnquete(id_enquete:string):Observable<ApiResponse<EnqueteData>>{
        return this.http.get<ApiResponse<EnqueteData>>(`${this.apiUrl}enquetes/user/${id_enquete}`)
    }

    responseEnquete(data:any):Observable<any>{
        return this.http.post<any>(`${this.apiUrl}responses/create`,data)
    }
}