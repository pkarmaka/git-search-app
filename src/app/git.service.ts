import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GitService {
  api = 'https://api.github.com';
  constructor(private http: HttpClient) { }

  getOrgRepos(org: String) {
    return this.http.get(`${this.api}/orgs/${org}/repos`);
  }
}
