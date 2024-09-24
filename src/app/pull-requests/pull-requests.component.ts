import { Component } from '@angular/core';
import { GithubService } from '../github.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pull-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pull-requests.component.html',
  styleUrl: './pull-requests.component.css'
})
export class PullRequestsComponent {
  pullRequests: any[] = [];
  selectedPullRequest: any | null = null;
  constructor(private gitHubService: GithubService){}

  ngOnInit():void {
    this.gitHubService.getPullRequests().subscribe((data)=> {
      console.log('Dados retornados:', data);
      this.pullRequests= data})
  }

  getStatusPt(status : string){
    if (status === "open")
      return "Aberto"
    else
      return "Fechado"
  }

  viewMore(pullRequest: any): void {
    this.selectedPullRequest = pullRequest; // Armazena o pull request que foi clicado
  }

  // Função chamada ao clicar em "Voltar"
  goBack(): void {
    this.selectedPullRequest = null; // Volta para a lista de pull requests
  }

  
 

}
