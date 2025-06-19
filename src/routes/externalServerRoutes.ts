import { Router } from 'express';
import { ExternalServerController } from '../controllers/externalServerController';

const router = Router();
const controller = new ExternalServerController();

router.get('/status', controller.getStatus);
router.get('/details', controller.getDetails);
router.put('/:id', controller.updateApiKey);
router.post('/', controller.addServer);

export default router;