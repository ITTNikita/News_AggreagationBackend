import { ExternalServerController } from '../../controllers/externalServerController';
import { ExternalServerService } from '../../services/externalServerService';

jest.mock('../../services/externalServerService');
const MockService = ExternalServerService as jest.MockedClass<typeof ExternalServerService>;

const mockServiceInstance = {
  getServerStatus: jest.fn(),
  getActiveServerDetails: jest.fn(),
  updateApiKey: jest.fn(),
  addServer: jest.fn(),
  addCategory: jest.fn(),
  getAllCategories: jest.fn()
};

(MockService as any).mockImplementation(() => mockServiceInstance);

describe('ExternalServerController', () => {
  let controller: ExternalServerController;
  const mockReq: any = {};
  const mockRes: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ExternalServerController(mockServiceInstance as any); // ✅ Inject mock here
  });

  it('should return formatted server status', async () => {
    const inputDate = new Date('2023-01-01');
    const expectedFormattedDate = inputDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }); // This will result in "01 Jan 2023"

    mockServiceInstance.getServerStatus.mockResolvedValue([
      { name: 'NewsAPI', is_active: 1, last_accessed: inputDate }
    ]);

    await controller.getStatus(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([
      {
        id: 1,
        name: 'NewsAPI',
        status: 'Active',
        lastAccessed: expectedFormattedDate
      }
    ]);
  });

  it('should handle status fetch failure', async () => {
    mockServiceInstance.getServerStatus.mockRejectedValue(new Error('fail'));
    await controller.getStatus(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Failed to fetch server statuses' });
  });

  it('should return server details', async () => {
    mockServiceInstance.getActiveServerDetails.mockResolvedValue([{ name: 'NewsAPI' }]);
    await controller.getDetails(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ name: 'NewsAPI' }]);
  });

  it('should return 404 if apiKey update fails', async () => {
    mockReq.params = { id: '5' };
    mockReq.body = { api_key: 'xyz' };
    mockServiceInstance.updateApiKey.mockResolvedValue(false);
    await controller.updateApiKey(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Server ID not found' });
  });

  it('should return 200 if apiKey update succeeds', async () => {
    mockReq.params = { id: '5' };
    mockReq.body = { api_key: 'xyz' };
    mockServiceInstance.updateApiKey.mockResolvedValue(true);
    await controller.updateApiKey(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'API key updated successfully' });
  });

  it('should return 500 if update apiKey throws error', async () => {
    mockReq.params = { id: '5' };
    mockReq.body = { api_key: 'xyz' };
    mockServiceInstance.updateApiKey.mockRejectedValue(new Error('fail'));
    await controller.updateApiKey(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Error updating API key' });
  });

  it('should add a server', async () => {
    mockReq.body = { parameters: { name: 'NewsAPI' } };
    await controller.addServer(mockReq, mockRes);
    expect(mockServiceInstance.addServer).toHaveBeenCalledWith({ name: 'NewsAPI' });
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'External server added successfully.' });
  });

  it('should add category and return response', async () => {
    mockReq.body = { parameters: 'sports' };
    mockServiceInstance.addCategory.mockResolvedValue('added');
    await controller.addCategory(mockReq, mockRes);
    expect(mockServiceInstance.addCategory).toHaveBeenCalledWith('sports');
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'added' });
  });

  it('should get all categories', async () => {
    mockServiceInstance.getAllCategories.mockResolvedValue([{ id: 1, category: 'sports' }]);
    const result = await controller.getAllCategories(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 1, category: 'sports' }]);
    expect(result).toEqual([{ id: 1, category: 'sports' }]);
  });
});
