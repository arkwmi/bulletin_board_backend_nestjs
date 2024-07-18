import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Article } from 'src/article/article.entity';
import { Token } from 'src/token/token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 256, nullable: true })
  email: string;

  @Column({ length: 50, nullable: true })
  nickname: string;

  @Column({ length: 256, nullable: true })
  password: string;

  @Column({ default: false })
  registerCompletedFlg: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Article, (article) => article.user)
  articles: Article[];
}
