import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders , HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com/repos/rails/rails/pulls';
  private token = '';
  files: { [key: number]: any[] } = {};

  constructor(private http: HttpClient) { }

  getPullRequests(page: number, per_page: number): Observable<any>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    const params = new HttpParams()
    .set('page', page.toString())
    .set('per_page', per_page.toString())
    .set('state', 'all');
    return this.http.get(this.apiUrl, { params });
  }

  getPullRequestFiles(pullNumber: number): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/${pullNumber}/files`);
  }

  getPullRequestComments(pullNumber: number): Observable<any[]>{
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    
    return this.http.get<any[]>(`https://api.github.com/repos/rails/rails/issues/${pullNumber}/comments`)
  }
} 
