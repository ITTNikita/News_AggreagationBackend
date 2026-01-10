import { UserController } from '../../controllers/userController';
import { UserService } from '../../services/userService';
import * as validators from '../../utils/validators';

jest.mock('../../services/userService');
const MockUserService = UserService as jest.MockedClass<typeof UserService>;

const mockServiceInstance = {
  findUserByEmail: jest.fn(),
  findUserByUserName: jest.fn(),
  createUser: jest.fn()
};

(MockUserService as any).mockImplementation(() => mockServiceInstance);

describe('UserController', () => {
  const controller = new UserController();
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if fields are missing on signup', async () => {
    const mockReq: any = { body: {} };
    await controller.signup(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'All fields are required' });
  });

  it('should return 400 if email is invalid', async () => {
    jest.spyOn(validators, 'isValidEmail').mockReturnValue(false);
    const mockReq: any = { body: { userName: 'test', userEmail: 'bademail', password: 'pass' } };
    await controller.signup(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid email format' });
  });

  it('should return 409 if user already exists', async () => {
    jest.spyOn(validators, 'isValidEmail').mockReturnValue(true);
    mockServiceInstance.findUserByEmail.mockResolvedValue({});
    const mockReq: any = { body: { userName: 'test', userEmail: 'test@mail.com', password: 'pass' } };
    await controller.signup(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(409);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Email already registered' });
  });

  it('should return 201 if user is successfully created', async () => {
    jest.spyOn(validators, 'isValidEmail').mockReturnValue(true);
    mockServiceInstance.findUserByEmail.mockResolvedValue(null);
    const mockReq: any = { body: { userName: 'test', userEmail: 'test@mail.com', password: 'pass' } };
    await controller.signup(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
  });

  it('should return 401 if login fails', async () => {
    const mockReq: any = { body: { username: 'test', password: 'wrongpass' } };
    mockServiceInstance.findUserByUserName.mockResolvedValue({ username: 'test', password: 'pass' });
    await controller.login(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 200 if login succeeds', async () => {
    const mockReq: any = { body: { username: 'test', password: 'pass' } };
    mockServiceInstance.findUserByUserName.mockResolvedValue({ username: 'test', password: 'pass' });
    await controller.login(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Login successful', user: { username: 'test', password: 'pass' } });
  });
});
