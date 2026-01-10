import { ExternalServerService } from '../../services/externalServerService';
import { ExternalServerRepository } from '../../repositories/externalServerRepository';

jest.mock('../../repositories/externalServerRepository');

const mockRepoInstance = {
  fetchStatus: jest.fn(),
  fetchDetails: jest.fn(),
  updateApiKey: jest.fn(),
  addServer: jest.fn(),
  addCategory: jest.fn(),
  getAllCategories: jest.fn()
};

(ExternalServerRepository as any).mockImplementation(() => mockRepoInstance);

describe('ExternalServerService', () => {
  let service: ExternalServerService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ExternalServerService(mockRepoInstance as any);
  });

  it('should get server statuses', async () => {
    mockRepoInstance.fetchStatus.mockResolvedValueOnce(['status']);
    const result = await service.getServerStatus();
    expect(result).toEqual(['status']);
  });

  it('should get active server details', async () => {
    mockRepoInstance.fetchDetails.mockResolvedValueOnce(['details']);
    const result = await service.getActiveServerDetails();
    expect(result).toEqual(['details']);
  });

  it('should update API key', async () => {
    mockRepoInstance.updateApiKey.mockResolvedValueOnce(true);
    const result = await service.updateApiKey(1, 'key');
    expect(result).toBe(true);
  });

  it('should add server', async () => {
    const serverInput = { name: 'NewAPI' };
    await service.addServer(serverInput as any);
    expect(mockRepoInstance.addServer).toHaveBeenCalledWith(serverInput);
  });

  it('should add category', async () => {
    mockRepoInstance.addCategory.mockResolvedValueOnce('done');
    const result = await service.addCategory('news');
    expect(result).toBe('done');
  });

  it('should get all categories', async () => {
    mockRepoInstance.getAllCategories.mockResolvedValueOnce(['cat']);
    const result = await service.getAllCategories();
    expect(result).toEqual(['cat']);
  });
});
