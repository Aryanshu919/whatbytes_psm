// typings.d.ts or any global type declaration file
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

// Augment the Request interface from express to include the `user` property
declare global {
  namespace Express {
    interface Request {
      CurrentUser?: any; // Or define a more specific type for `user` if needed
    }
  }
}
