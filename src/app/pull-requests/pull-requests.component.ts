import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { GithubService } from '../github.service';
import { CommonModule } from '@angular/common';
import { runTests, orderBy} from '../util';
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
  // Controle de paginação
  currentPage: number = 1;
  perPage: number = 30; // Número de pull requests por página
  totalPages: number = 0; // Total de páginas
  searchTerm: string = '';  // Armazena o termo da busca
  
  constructor(private gitHubService: GithubService,
    private viewportScroller: ViewportScroller,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadPullRequests(this.currentPage);
    runTests();
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

  loadPullRequests(page: number){
    this.gitHubService.getPullRequests(page, this.perPage).subscribe((data: PullRequest[]) => {
      console.log('Dados retornados:', data);
      console.log(Object.keys(data))
      this.pullRequests = data
      this.original = data
      this.pullRequests = data.map((pullRequest: any) => {
        // Fazendo a requisição dos comentários
        this.gitHubService.getPullRequestComments(pullRequest.number).subscribe(comments => {
          // Adicionando o atributo 'commentsCount' dinamicamente ao objeto
          pullRequest.commentsCount = comments.length;
        });
        return pullRequest;
      });
      if (data.length < this.perPage) {
        this.totalPages = this.currentPage; // Sem mais páginas, chegamos à última
      }
    })
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadPullRequests(page);
    this.order = 'data'
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

  filterPullRequests(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase(); // Pega o valor do input e transforma em minúsculas
    this.pullRequests = this.original.filter(pr =>
      pr.title.toLowerCase().includes(searchTerm)
    );
  }

  






}
