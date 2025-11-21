import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'livros-angular';

  constructor(private router: Router) {}

  isHomePage(): boolean {
    return this.router.url === '/home';
  }
}
