import express from 'express';
import cors from 'cors';
import EventController from './controllers/EventController';
import AuthMiddleware from './middlewares/AuthMiddleware';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth', EventController.authenticate);
app.get('/api/events', AuthMiddleware.verifyToken, EventController.getEvents);
app.get('/api/events/:id', AuthMiddleware.verifyToken, EventController.getEventById);

export default app;
