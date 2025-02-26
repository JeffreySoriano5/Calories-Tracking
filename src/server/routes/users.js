import express from 'express';
import UserController from '../controllers/user';
import secure from '../middlewares/authorization';
import validate from '../middlewares/validation';
import {createSchema, listSchema, readSchema, updateSchema, deleteSchema} from './schemas/user';

const router = express.Router();

router.use(secure.isAuthenticated);

router.post('/', secure.can('create', 'user'), validate(createSchema), UserController.user_create_post);

router.get('/', secure.can('read', 'user'), validate(listSchema), UserController.user_list);

router.get('/:id', validate(readSchema), UserController.user_get);

router.put('/:id', validate(updateSchema), UserController.user_update);

router.delete('/:id', validate(deleteSchema), UserController.user_delete);

export default router;
