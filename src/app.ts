import express from 'express';
import cors from 'cors';
import EventController from './controllers/EventController';
import AuthMiddleware from './middlewares/AuthMiddleware';
import LocationController from './controllers/LocationController';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auth', EventController.authenticate);
app.post('/api/location', LocationController.search);
app.get('/api/events', AuthMiddleware.verifyToken, EventController.getEvents);
app.get('/api/events/:id', AuthMiddleware.verifyToken, EventController.getEventById);

export default app;
