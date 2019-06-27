import express from 'express';
import MealController from '../controllers/meal';
import secure from '../middlewares/authorization';
import validate from '../middlewares/validation';
import {createSchema, listSchema, readSchema, updateSchema, deleteSchema} from './schemas/meal';

const router = express.Router();

router.use(secure.isAuthenticated);

router.post('/', validate(createSchema), MealController.meal_create_post);

router.get('/', validate(listSchema), MealController.meal_list);

router.get('/:id', validate(readSchema), MealController.meal_get);

router.put('/:id', validate(updateSchema), MealController.meal_update);

router.delete('/:id', validate(deleteSchema), MealController.meal_delete);

export default router;
