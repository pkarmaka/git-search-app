import { Component } from '@angular/core';
import { GitService } from './git.service';
import { FormControl } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  filter = new FormControl('');
  title = 'Github Search';
  repos: Observable<any[]>;
  data = [];
  isLoaded = false;
  constructor(private gitService: GitService) {
    this.repos = this.filter.valueChanges.pipe(
      startWith(''),
      map(text => this.search(text))
    );
   }

  showRepos(orgName: String) {
    this.gitService.getOrgRepos(orgName)
      .subscribe((response) => {
        this.data = Object.values(response).sort((a, b) => b.forks - a.forks);
        this.isLoaded = true;
        //  console.log(this.repos.sort((a, b) => b.forks - a.forks));
      });
  }

  search(text: string) {
    return this.data.filter(repo => {
      const term = text.toLowerCase();
      return repo.name.toLowerCase().includes(term);
    });
  }
}
