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

  @Column({ nullable: false })
  userId: number;

  @Column({
    type: 'text',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'longtext',
    charset: 'utf8mb4',
    collation: 'utf8mb4_general_ci',
    nullable: false,
  })
  content: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
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
