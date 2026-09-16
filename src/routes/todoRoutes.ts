import { Router } from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../controllers/todoController';
import { verifyToken } from '../middlewares/authMiddleware'; // Sesuaikan path file jika folder kamu 'middleware' tanpa 's'

const router = Router();

// Pasang middleware verifyToken
router.use(verifyToken);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;