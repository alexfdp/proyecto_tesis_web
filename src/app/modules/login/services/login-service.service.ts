import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from 'src/app/models/Auth';
import { AuthToken } from 'src/app/models/AuthToken';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  private auth = "auth"

  constructor(private http: HttpClient) { }

  public autenticar(datauser: Auth): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${environment.apiUrl}/${this.auth}`, datauser);
  }

  public cargar(archivos: string[]) {
    for (let archivo of archivos) {
      let script = document.createElement("script");
      script.src = './assets/js/' + archivo + '.js';
      let body = document.getElementsByTagName('body')[0];
      body.appendChild(script);
    }
  }
}
