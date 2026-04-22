// Copyright (c) 2026 Flavio Almeida
// Licensed under the MIT License

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeMulter } from '../multer/multer';
import ingestionRoutes from '../../../modules/ingestion/interfaces/http/ingestion/ingestion.routes';

const app = express();

initializeMulter(app);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

ingestionRoutes(app);

app.use((req: Request, res: Response) => {
	res.status(404).json({ message: `route ${req.originalUrl} does not exist!` });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Internal server error' });
	next();
});

export { app };

