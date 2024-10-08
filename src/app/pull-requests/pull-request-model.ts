export interface PullRequest {
    title: string;
    number: number;
    created_at: string;
    updated_at: string;
    closed_at: string | null;
    state: string;
    commentsCount?: number; 
    html_url: string;
    login?: string
  }