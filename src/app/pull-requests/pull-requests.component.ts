import { Component, ChangeDetectorRef } from '@angular/core';
import { GithubService } from '../github.service';
import { CommonModule } from '@angular/common';
import { groupBy } from '../util';
import { ViewportScroller } from '@angular/common';



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
  files: { [key: number]: any[] } = {};
  constructor(private gitHubService: GithubService, 
              private viewportScroller: ViewportScroller,
              private cdr: ChangeDetectorRef){}

  ngOnInit():void {
    this.gitHubService.getPullRequests().subscribe((data)=> {
      console.log('Dados retornados:', data);
      console.log(Object.keys(data))
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

  goSite(): void{
    window.open(this.selectedPullRequest.html_url, '_blank');
  }
  loadFiles(prNumber: number) {
    if (!this.files[prNumber]) {
      // Chamando o serviço para obter os arquivos modificados do PR
      this.gitHubService.getPullRequestFiles(prNumber).subscribe((data: any[]) => {
        this.files[prNumber] = data;

        // Após receber os dados, forçamos a detecção de mudanças
        this.cdr.detectChanges();

        // Em seguida, rola para a posição desejada
        this.viewportScroller.scrollToPosition([0, 500]);
      });
    } else {
      // Se os arquivos já estiverem carregados, apenas rolar
      this.viewportScroller.scrollToPosition([0, 500]);
    }
  }

  

  
 

}
