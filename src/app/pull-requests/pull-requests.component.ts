import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { GithubService } from '../github.service';
import { CommonModule } from '@angular/common';
import { groupBy , orderBy} from '../util';
import { ViewportScroller } from '@angular/common';
import { DateTime } from "luxon";
import { setThrowInvalidWriteToSignalError } from '@angular/core/primitives/signals';
import { PullRequest } from './pull-request-model';



@Component({
  selector: 'app-pull-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pull-requests.component.html',
  styleUrl: './pull-requests.component.css'
})
export class PullRequestsComponent {

  @Input() filtros: any = {};
  @Input() order: string = "";
  pullRequests: PullRequest[] = [];
  comments: any[] = [];
  commentsLenght: number=0;
  original: PullRequest[] = [];
  selectedPullRequest: PullRequest | null = null;
  files: { [key: number]: any[] } = {};
  constructor(private gitHubService: GithubService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    
    this.gitHubService.getPullRequests().subscribe((data: PullRequest[]) => {
      console.log('Dados retornados:', data);
      console.log(Object.keys(data))
      this.pullRequests = data
      this.original = data
      this.pullRequests = data.map((pullRequest: any) => {
        // Fazendo a requisição dos comentários
        this.gitHubService.getPullRequestComments(pullRequest.number).subscribe(comments => {
          // Adicionando o atributo 'commentsCount' dinamicamente ao objeto
          pullRequest.commentsCount = comments.length;
          console.log(comments)
        });
        return pullRequest;
      });
    })
  }

  ngOnChanges() {
    let res = this.original
    if (this.filtros.author != "" && this.filtros.author != undefined) {
      res = res.filter(it => it.user.login == this.filtros.author)
    }
    if (this.filtros.date != "" && this.filtros.date != undefined) {
      const data1 = DateTime.fromISO(this.filtros.date).startOf('day');
      res = res.filter(it => {
        const data2 = DateTime.fromISO(it.created_at).startOf('day');
        return data1.equals(data2)
      })
    }
    if (this.filtros.state != "" && this.filtros.state != "all" && this.filtros.state != undefined ) {
      res = res.filter(it => it.state == this.filtros.state)
    }
      this.pullRequests = res
    if(this.order == "data"){
      this.pullRequests = orderBy(this.pullRequests, 'created_at' )
      console.log(this.pullRequests)
    }
    else if(this.order == "comentarios"){
      this.pullRequests = orderBy(this.pullRequests, 'commentsCount')
    }

    
  }

  getStatusPt(status: string) {
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

  goSite(): void {
    if(this.selectedPullRequest!= null){
      window.open(this.selectedPullRequest.html_url, '_blank');
    }
    
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

  getDate(data: string): string{
    return  DateTime.fromISO(data).toFormat('yyyy-MM-dd');
  }

  getHour(data: string): string{
    return DateTime.fromISO(data).toFormat('HH:mm:ss')
  }

  






}
