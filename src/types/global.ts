import { IDeveloper } from "./developer";

declare global {
	namespace Express {
		interface Request {
			user: IDeveloper;
		}
	}
}
