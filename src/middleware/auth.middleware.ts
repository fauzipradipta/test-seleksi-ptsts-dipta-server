import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// export const authorizeRole = (role: string) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     // if (!req.user || !roles.includes(req.user.role)) {
//     //   return res.status(403).json({ message: 'Forbidden' });
//     // }
//     // next();
//     const userRole = req.user?.roles;
//     if(userRole === role){
//       return next();
//     }

//     return res.status(403).json({ message: 'Forbidden' });
//   };
// };

export const authorizeRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; // Assuming `req.user` contains the authenticated user's info

    if (userRole === role) {
      return next(); // Proceed to the next middleware
    }

    // If the role does not match, send a 403 Forbidden response
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  };
};