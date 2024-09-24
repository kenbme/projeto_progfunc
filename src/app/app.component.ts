import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PullRequestsComponent } from './pull-requests/pull-requests.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PullRequestsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meu-projeto';
}
