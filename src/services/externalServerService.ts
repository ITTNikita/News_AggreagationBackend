import { ExternalServerInput } from '../models/ExternalServerInput.model';
import { ExternalServerRepository } from '../repositories/externalServerRepository';
const serverRepo = new ExternalServerRepository();

export class ExternalServerService {
  getServerStatus() {
    return serverRepo.fetchStatus();
  }

  getActiveServerDetails() {
    return serverRepo.fetchDetails();
  }

  updateApiKey(id: number, api_key: string) {
    return serverRepo.updateApiKey(id, api_key);
  }

  addServer(server: ExternalServerInput) {
    console.log("testing server adding", server);
    const jinhjihn = serverRepo.addServer(server);
    console.log(jinhjihn);
    return jinhjihn;
  }
}