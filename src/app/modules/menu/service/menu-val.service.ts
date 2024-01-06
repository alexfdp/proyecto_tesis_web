import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from 'src/app/models/UserData';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuValService {
  private user = "user"

  constructor(private http: HttpClient) { }

  public getUserData() {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem("token"));
    return this.http.get<UserData>(`${environment.apiUrl}/${this.user}`, { headers });
  }
}
