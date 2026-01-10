import { UserService } from '../../services/userService';

describe('UserService', () => {
  const mockRepoInstance = {
    findByEmail: jest.fn(),
    findByUserName: jest.fn(),
    create: jest.fn()
  };

  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UserService(mockRepoInstance as any);
  });

  it('should find user by email', async () => {
    mockRepoInstance.findByEmail.mockResolvedValue({ email: 'test@mail.com' });
    const result = await service.findUserByEmail('test@mail.com');
    expect(result).toEqual({ email: 'test@mail.com' });
  });

  it('should find user by username', async () => {
    mockRepoInstance.findByUserName.mockResolvedValue({ username: 'test' });
    const result = await service.findUserByUserName('test');
    expect(result).toEqual({ username: 'test' });
  });

  it('should create a new user', async () => {
    await service.createUser('test', 'test@mail.com', 'pass');
    expect(mockRepoInstance.create).toHaveBeenCalledWith('test', 'test@mail.com', 'pass');
  });
});
