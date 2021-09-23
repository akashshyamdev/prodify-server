import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import app from './app';

process.on('uncaughtException', (err) => {
	console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
	console.log(err.name, err.message);
	process.exit(1);
});

dotenv.config({ path: path.resolve(__dirname, '../.env') });

mongoose
	.connect(process.env.MONGO_URI!, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log('DB connection successful!'));

const server = app.listen(process.env.PORT || 5000, () => {
	console.log('----------------------------------------------------------------------------');
	console.log(`SERVER RUNNING IN ${process.env.NODE_ENV?.toUpperCase()} ON PORT ${process.env.PORT}`);
	console.log('----------------------------------------------------------------------------');
});

process.on('unhandledRejection', (err: { name: string; message: string }) => {
	console.log('UNHANDLED REJECTION! 💥 Shutting down...');
	console.log(err?.name, err?.message);

	server.close(() => {
		process.exit(1);
	});
});
