import { ExternalServerInput } from '../models/ExternalServerInput.model';
import { ExternalServerRepository } from '../repositories/externalServerRepository';
const serverRepo = new ExternalServerRepository();

export class ExternalServerService {
  constructor(private serverRepo = new ExternalServerRepository()) {}
  async getServerStatus() {
    return this.serverRepo.fetchStatus();
  }

  async getActiveServerDetails() {
    return this.serverRepo.fetchDetails();
  }

  async updateApiKey(id: number, api_key: string) {
    return this.serverRepo.updateApiKey(id, api_key);
  }

  async addServer(server: ExternalServerInput) {     
    return  this.serverRepo.addServer(server);
  }

  async addCategory(category:string)
  {   
    return this.serverRepo.addCategory(category);
  }

  async getAllCategories()
  {
    return this.serverRepo.getAllCategories();
  }
}