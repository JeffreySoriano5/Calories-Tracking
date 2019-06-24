import express from 'express';
import UserController from '../controllers/user';
import secure from '../controllers/express';

const router = express.Router();

router.use(secure.isAuthenticated);

router.post('/', secure.can('create', 'user'), UserController.user_create_post);

router.get('/', secure.can('read', 'user'), UserController.user_list);

router.get('/:id', secure.can('read', 'user'), UserController.user_get);

router.put('/:id', secure.can('update', 'user'), UserController.user_update);

router.delete('/:id', secure.can('delete', 'user'), UserController.user_delete);

export default router;
