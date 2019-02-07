import { Component } from '@angular/core';
import { GitService } from '../services/git.service';
import { FormControl } from '@angular/forms';
import { NgbModule, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  filter = new FormControl('');
  title = 'Github Search';
  repos$: Observable<any[]>;
  total$: Observable<number>;
  error$: Observable<number>;
  data = [];
  commits: Array<any> = [];
  collectionSize;

  constructor(public gitService: GitService, private modalService: NgbModal) {
    this.repos$ = gitService.repos$;
    this.total$ = gitService.total$;
    this.error$ = gitService.error$;
  }

  // Call service to get list of repositories
  showRepos(orgName: String) {
    this.gitService.getOrgRepos(orgName);
  }

  /** Click on the icon beside a repo to load
   *  a modal with the list of its latest commits
   **/
  open(content, repo) {
    this.gitService.getCommits(repo.name, repo.owner.login).subscribe((response) => {
      this.commits = [];
      Object.values(response).slice(0, 5).forEach((commit) => {
        this.commits.push({
          message: commit.commit.message,
          author: commit.author != null ? commit.author.login : '-',
          date: commit.commit.author.date
        });
      });
      this.modalService.open(content);
    });
  }
}
