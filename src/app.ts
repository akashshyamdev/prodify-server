import cors from 'cors';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import developerRoutes from './routes/developers';
import notesRoutes from './routes/notes';

const app = express();

// Middleware
app.use(helmet());

app.use(cors());

app.use(morgan('dev'));

app.use(express.json());

app.get('/api', function (req: Request, res: Response) {
  res.send(`You are running the server in ${process.env.NODE_ENV} on PORT ${process.env.PORT}`);
});

// Routes
app.use('/api/developers', developerRoutes);
app.use('/api/notes', notesRoutes);

export default app;
