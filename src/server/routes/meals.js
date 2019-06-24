import express from 'express';
import MealController from '../controllers/meal';
import secure from '../controllers/express';

const router = express.Router();

router.use(secure.isAuthenticated);

router.post('/', secure.can('create', 'meal'), MealController.meal_create_post);

router.get('/', secure.can('read', 'meal'), MealController.meal_list);

router.get('/:id', secure.can('read', 'meal'), MealController.meal_get);

router.put('/:id', secure.can('update', 'meal'), MealController.meal_update);

router.delete('/:id', secure.can('delete', 'meal'), MealController.meal_delete);

export default router;
