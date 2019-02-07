import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {debounceTime, delay, switchMap, tap, catchError} from 'rxjs/operators';

interface SearchResult {
  repos: any[];
  total: number;
}

function matches(repo, term: string) {
  return repo.name.toLowerCase().includes(term.toLowerCase());
}

@Injectable({
  providedIn: 'root'
})
export class GitService {
  api = 'https://api.github.com';
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _repos$ = new BehaviorSubject<any[]>([]);
  private repos = [];
  private _total$ = new BehaviorSubject<number>(0);
  private _state = {
    page: 1,
    pageSize: 10,
    searchTerm: ''
  };
  private _error$ = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      tap(() => this._loading$.next(false)),
    ).subscribe(result => {
      this._repos$.next(result.repos);
      this._total$.next(result.total);
    });

    this._search$.next();
   }

    get repos$() { return this._repos$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }
    get error$() { return this._error$.asObservable(); }

    set page(page: number) { this._set({page}); }
    set pageSize(pageSize: number) { this._set({pageSize}); }
    set searchTerm(searchTerm: string) { this._set({searchTerm}); }

    private _set(patch) {
      Object.assign(this._state, patch);
      this._search$.next();
    }

   private _search(): Observable<SearchResult> {
    const {pageSize, page, searchTerm} = this._state;
    let repos = this.repos;
    // 1. filter
    repos = repos.filter(country => matches(country, searchTerm));
    const total = repos.length;

    // 2. paginate
    repos = repos.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({repos, total});
  }

  getOrgRepos(org: String) {
    this.http.get(`${this.api}/orgs/${org}/repos?per_page=100`).subscribe(
      (response) => {
      this.repos = [];
      this.repos = Object.values(response).sort((a, b) => b.forks - a.forks);
      this._error$.next(0);
      this._search$.next();
    }, (err) => {
      if (err.status === 404) {
        this._error$.next(err.status);
      }
    }
    );
  }

  getCommits(repo: String, owner: String) {
    return this.http.get(`${this.api}/repos/${owner}/${repo}/commits`);
  }
}
