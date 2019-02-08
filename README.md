# Git-Search-App

This app provides the top public Repositories of an Organization using Github's API.
They are sorted by the number of forks. The app has a searchable feature to locate a repo in the list. You can also view the latest commits in a repository.

## Tech Stack :hammer:
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.
Other Libraries : ng-bootstrap, rxjs

## Details
APIs used : https://developer.github.com/v3/repos/#list-organization-repositories
            https://developer.github.com/v3/repos/commits/#list-commits-on-a-repository
            
Based on my experience with Angular, it seemed best to use Angular as my choice of framework. Angular provides a nice CLI tool to spin up an app right out of the box in a few seconds. As this is a small app I have kept only one component - the app component. With more capabilities it would make more sense to have more reusable components.

ng-bootstrap is a wrapper on Bootstrap, and it provides usable angular widgets. I have used the table and modal components for my use case. Styling was made easier with the Bootstrap framework.

The app has a git service defined which deals with the api calls and processing of the response. The response is sorted based on the number of forks. The setting of the data behind the template happens in the service, which is then used through the app.component.ts. The table provides a searching capability that allows us to jump to a particular repo. Click on the icon beside the repo name entry to reveal the most recent commits.

rxjs helped with asynchronous aspects of the app. It is a Reactive Extensions Library for JavaScript. Observables are used for the table data which helped me to asynchronously change the template based on api response and also on searching and pagination. 

## Development server :zap:

Steps: 
1. `git clone https://github.com/pkarmaka/git-search-app.git`
2. `cd git-search-app/`
3. `npm install`
4. `npm install -g @angular/cli`
5. `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

