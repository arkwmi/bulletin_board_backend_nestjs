import { Test, TestingModule } from '@nestjs/testing';
import { ArticleService } from './article.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Comment } from '../comment/comment.entity';
import { InternalServerErrorException } from '@nestjs/common';

const mockArticleRepository = () => ({
  count: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockCommentRepository = () => ({
  delete: jest.fn(),
});

describe('ArticleService', () => {
  let articleService: ArticleService;
  let articleRepository: jest.Mocked<Repository<Article>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useFactory: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useFactory: mockCommentRepository,
        },
      ],
    }).compile();

    articleService = module.get<ArticleService>(ArticleService);
    articleRepository = module.get<Repository<Article>>(
      getRepositoryToken(Article),
    ) as jest.Mocked<Repository<Article>>;
  });

  describe('getArticleDetail', () => {
    it('成功', async () => {
      const article = {
        id: 1,
        title: 'TestTitle',
        content: 'TestContent',
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
        comments: [
          {
            id: 1,
            comment: 'TestComment',
            createdAt: new Date(),
            user: { nickname: 'TestUser' },
          },
        ],
      } as Article;

      articleRepository.findOne.mockResolvedValue(article);

      const result = await articleService.getArticleDetail(1);

      expect(result).toEqual({
        id: 1,
        title: 'TestTitle',
        content: 'TestContent',
        createdAt: article.createdAt,
        comments: [
          {
            id: 1,
            comment: 'TestComment',
            createdAt: article.comments[0].createdAt,
            nickname: 'TestUser',
          },
        ],
      });
    });

    it('サーバーエラー', async () => {
      articleRepository.findOne.mockRejectedValue(
        new Error('記事詳細の取得に失敗しました'),
      );

      await expect(articleService.getArticleDetail(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
