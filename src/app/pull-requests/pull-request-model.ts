export interface PullRequest {
    title: string;
    number: number;
    user: {
      login: string;
    };
    created_at: string;
    updated_at: string;
    state: string;
    commentsCount?: number; // Atributo que você vai adicionar dinamicamente
    html_url: string;
    // Adicione outros atributos conforme necessário
  }