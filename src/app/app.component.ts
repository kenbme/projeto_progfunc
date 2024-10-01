import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PullRequestsComponent } from './pull-requests/pull-requests.component';
import { NgIf , NgClass} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PullRequestsComponent, NgIf, FormsModule, NgClass,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'meu-projeto';
  showFilter = true;
  ordenacao = "data"; // por padrão, inicia filtrando pela data de criação do Pull

  author: string = ''
  date: string = ''
  state: string = ''

  filtrosPull: any = {}

  toggleFilter() {
    this.showFilter = !this.showFilter
  }
  toggleOrderBy(order: string){
    this.ordenacao = order;
    console.log(this.ordenacao)
  }
  submitForm() {
    this.filtrosPull = { author: this.author, date: this.date, state: this.state }
  }

   resetOrder(){
    this.ordenacao= 'data';
  }
}
