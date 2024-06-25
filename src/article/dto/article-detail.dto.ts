export class ArticleDetail {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  comments: {
    id: number;
    comment: string;
    createdAt: Date;
    nickname: string;
  }[];
}
