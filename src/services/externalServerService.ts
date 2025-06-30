import { ExternalServerInput } from '../models/ExternalServerInput.model';
import { ExternalServerRepository } from '../repositories/externalServerRepository';
const serverRepo = new ExternalServerRepository();

export class ExternalServerService {
  async getServerStatus() {
    return serverRepo.fetchStatus();
  }

  async getActiveServerDetails() {
    return serverRepo.fetchDetails();
  }

  async updateApiKey(id: number, api_key: string) {
    return serverRepo.updateApiKey(id, api_key);
  }

  async addServer(server: ExternalServerInput) {     
    return  serverRepo.addServer(server);
  }

  async addCategory(category:string)
  {   
    return serverRepo.addCategory(category);
  }

  async getAllCategories()
  {
    return serverRepo.getAllCategories();
  }
}