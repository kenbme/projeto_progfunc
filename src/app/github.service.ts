import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/repos/rails/rails/pulls';


  constructor(private http: HttpClient) { }

  getPullRequests(): Observable<any>{
    return this.http.get(this.apiUrl)
  }

  
}
