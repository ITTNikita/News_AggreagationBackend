import { Request, Response } from 'express';
import { ExternalServerService } from '../services/externalServerService';
import { ExternalServerInput } from '../models/ExternalServerInput.model';

export class ExternalServerController {
  constructor(private serverService = new ExternalServerService()) {}

  async getStatus(req: Request, res: Response) {
    try {
      const statuses = await this.serverService.getServerStatus();
      const formattedResults = Array.isArray(statuses)
        ? statuses.map((row: any, index: number) => ({
            id: index + 1,
            name: row.name,
            status: row.is_active ? 'Active' : 'Not Active',
            lastAccessed: new Date(row.last_accessed).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
          }))
        : [];

      res.status(200).json(formattedResults);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch server statuses' });
    }
  }

  async getDetails(req: Request, res: Response) {
    try {
      const details = await this.serverService.getActiveServerDetails();
      res.status(200).json(details);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch server details' });
    }
  }

  async updateApiKey(req: Request, res: Response) {
    const { id } = req.params;
    const { api_key } = req.body;
    try {
      const success = await this.serverService.updateApiKey(parseInt(id), api_key);
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
      const server: ExternalServerInput = req.body.parameters;
      await this.serverService.addServer(server);
      res.status(201).json({ message: 'External server added successfully.' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to add server.' });
    }
  }

  async addCategory(req: Request, res: Response) {
    try {
      const category: string = req.body.parameters;
      const response = await this.serverService.addCategory(category);
      res.status(201).json({ message: response });
    } catch (error) {
      res.status(500).json({ message: 'Failed to add category' });
    }
  }

  async getAllCategories(req: Request, res: Response) {
    try {
      const categories = await this.serverService.getAllCategories();
      res.status(200).json(categories);
      return categories; 
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  }
}
