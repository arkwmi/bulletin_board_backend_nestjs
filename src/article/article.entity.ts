import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', length: 7 })
  userId: string;

  @Column({ name: 'title', type: 'text' })
  title: string;

  @Column({ name: 'content', type: 'longtext' })
  content: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn({ name: 'userId' })
  user: User;
}
