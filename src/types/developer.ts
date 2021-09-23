import { Document } from 'mongoose';

export interface IDeveloper extends Document {
	id: string;
	firstName: string;
	lastName: string;
	userName: string;
	password: string;
	createdAt: number;
	comparePasswords: (candidatePassword: string, correctPassword: string) => Promise<boolean>;
}
