import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Board } from '../board/board.entity';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: any;
  let cacheManager: any;

  const mockPostRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    increment: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get(getRepositoryToken(Post));
    cacheManager = module.get(CACHE_MANAGER);

    jest.clearAllMocks();
  });

  // findAll (Cache miss)
  it('should return popular posts from DB when cache is empty', async () => {
    mockCacheManager.get.mockResolvedValue(null); // 캐시 없음
    const mockPosts = [{ id: 1, title: 'Hello', viewCount: 10 }];
    mockPostRepository.find.mockResolvedValue(mockPosts);

    const result = await postService.findAll();

    expect(mockCacheManager.get).toHaveBeenCalledWith('popular_posts');
    expect(mockPostRepository.find).toHaveBeenCalled();
    expect(mockCacheManager.set).toHaveBeenCalled();
    expect(result).toEqual(mockPosts);
  });

  // findAll (Cache hit)
  it('should return cached popular posts when cache exists', async () => {
    const cachedPosts = [{ id: 1, title: 'Cached' }];
    mockCacheManager.get.mockResolvedValue(cachedPosts);

    const result = await postService.findAll();

    expect(mockCacheManager.get).toHaveBeenCalledWith('popular_posts');
    expect(mockPostRepository.find).not.toHaveBeenCalled();
    expect(result).toEqual(cachedPosts);
  });

  // findOne (Cache miss)
  it('should return a post from DB when cache is empty', async() => {
    const mockPost = { id: 1, title: 'Hello' };

    mockCacheManager.get.mockResolvedValue(null);
    mockPostRepository.findOne.mockResolvedValue(mockPost);

    const result = await postService.findOne(1);

    expect(mockCacheManager.get).toHaveBeenCalledWith('post:1');
    expect(mockPostRepository.findOne).toHaveBeenCalled();
    expect(mockCacheManager.set).toHaveBeenCalledWith('post:1', mockPost, expect.any(Number));
    expect(result).toEqual(mockPost);
  });

  // findOne (Cache hit)
  it('should return a cached post when cache exists', async() => {
    const cachedPost = { id: 1, title: 'Cached Post' };

    mockCacheManager.get.mockResolvedValue(cachedPost);

    const result = await postService.findOne(1);

    expect(mockCacheManager.get).toHaveBeenCalledWith('post:1');
    expect(mockPostRepository.findOne).not.toHaveBeenCalled();
    expect(result).toEqual(cachedPost);
  });
  
  // updateViewCount
  it('should increment view count and clear cache', async() => {
    await postService.updateViewCount(1);

    expect(postRepository.increment).toHaveBeenCalledWith({ id: 1}, 'viewCount', 1);
    expect(mockCacheManager.del).toHaveBeenCalledWith('post:1');
    expect(mockCacheManager.del).toHaveBeenCalledWith('popular_posts');
  });

  // create
  it('should create a new post', async() => {
    const dto = { title: 'Test', content: 'Content', boardId: 1 };
    const user = new User();
    const board = new Board();
    const files = [];

    const mockPost = { id: 1, ...dto };

    mockPostRepository.create.mockReturnValue(mockPost);
    mockPostRepository.save.mockResolvedValue(mockPost);

    const result = await postService.create(dto, user, board, files);

    expect(postRepository.create).toHaveBeenCalled();
    expect(postRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockPost);
  });

  // remove
  it('should remove a post', async() => {
    const mockPost = { id: 1 };

    mockCacheManager.get.mockResolvedValue(null);
    mockPostRepository.findOne.mockResolvedValue(mockPost);
    mockPostRepository.remove.mockResolvedValue(mockPost);

    const result = await postService.remove(1);

    expect(postRepository.remove).toHaveBeenCalledWith(mockPost);
    expect(result).toEqual(mockPost);
  });
});
