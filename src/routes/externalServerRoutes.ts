import { Router } from 'express';
import { ExternalServerController } from '../controllers/externalServerController';

const router = Router();
const externalServerController = new ExternalServerController();

router.get('/status', externalServerController.getStatus.bind(externalServerController));
router.get('/details', externalServerController.getDetails.bind(externalServerController));
router.put('/:id', externalServerController.updateApiKey.bind(externalServerController));
router.post('/', externalServerController.addServer.bind(externalServerController));
router.post('/new-category',externalServerController.addCategory.bind(externalServerController));

export default router;