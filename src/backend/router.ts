import { Request, Response, Router } from 'express';

import authController from './controllers/auth.controller';
import bookableAreasController from './controllers/bookableAreas.controller';
import euupController from './controllers/euup.controller';
import metaController from './controllers/meta.controller';
import authMiddleware from './middleware/auth.middleware';
import { permissionMiddleware } from './middleware/permission.middleware';

const router = Router();

router.get('/endpoint');

router.get('/areas/ED', euupController.getEuupData);

router.get('/config/frontend', metaController.getFrontendConfig);

router.get('/bookableareas', bookableAreasController.getBookableAreas);
router.patch('/bookableareas', authMiddleware, permissionMiddleware, bookableAreasController.addBookingToArea);
router.delete('/bookings/:id', authMiddleware, permissionMiddleware, bookableAreasController.deleteBookingFromArea);

router.get('/auth/login', authController.authUser);
router.get('/auth/logout', authController.logoutUser);
router.get('/auth/profile', authMiddleware, authController.getProfile);

router.use((req: Request, res: Response) => {
  // 404
  res.status(404).json({ msg: 'the requested resource could not be found' });
});

export default { router };
