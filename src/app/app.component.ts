import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PullRequestsComponent } from './pull-requests/pull-requests.component';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PullRequestsComponent, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meu-projeto';
  showFilter = true;

  author: string = ''
  date: string = ''
  state: string = ''

  filtrosPull: any = {}

  toggleFilter() {
    this.showFilter = !this.showFilter
  }

  submitForm() {
    this.filtrosPull = { author: this.author, date: this.date, state: this.state }
  }
}
