import { Request, Response } from 'express';
import { ExternalServerService } from '../services/externalServerService';
import { ExternalServerInput } from '../models/ExternalServerInput.model';

const serverService = new ExternalServerService();

export class ExternalServerController {
  async getStatus(req: Request, res: Response) {
    try {
      const statuses = await serverService.getServerStatus();
      let formattedResults: any[] = [];
        if (Array.isArray(statuses)) {
        formattedResults = statuses.map((row: any, index: number) => {
            return {
            id: index + 1,
            name: row.name,
            status: row.is_active ? 'Active' : 'Not Active',
            lastAccessed: new Date(row.last_accessed).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            };
        });
        }
      res.status(200).json(formattedResults);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch server statuses' });
    }
  }

  async getDetails(req: Request, res: Response) {
    try {
      const details = await serverService.getActiveServerDetails();
      res.status(200).json(details);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch server details' });
    }
  }

  async updateApiKey(req: Request, res: Response) {
    const { id } = req.params;
    const { api_key } = req.body;
    try {
      const success = await serverService.updateApiKey(parseInt(id), api_key);
      if (!success) {
        res.status(404).json({ message: 'Server ID not found' });
      } else {
        res.status(200).json({ message: 'API key updated successfully' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Error updating API key' });
    }
  }

  async addServer(req: Request, res: Response) {
    try {
      const server : ExternalServerInput = req.body.parameters;
      await serverService.addServer(server);
      res.status(201).json({ message: 'External server added successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add server.' });
    }
  }
}