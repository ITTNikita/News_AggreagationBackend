import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { isValidEmail } from '../utils/validators';
import { logMessage } from '../../logs/logService';
import { log } from 'console';



export class UserController {

  constructor(private  userService = new UserService()) {}
  async signup(req: Request, res: Response): Promise<void> {  
    logMessage('User signup request received'); 
    const { userName, userEmail, password } = req.body;
    if (!userName || !userEmail || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }
    if (!isValidEmail(userEmail)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }
    try {
      const existing = await this.userService.findUserByEmail(userEmail);
      if (existing) {
        res.status(409).json({ message: 'Email already registered' });
        return;
      }
      await this.userService.createUser(userName, userEmail, password);
      res.status(201).json({ message: 'User registered successfully' });
    } catch {
      res.status(500).json({ message: 'Server error during signup' });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    logMessage('User login request received');
    const { username, password} = req.body;
    try {
      const user = await this.userService.findUserByUserName(username);
      if (!user || user.password !== password) {
        res.status(401).json({ message: 'Invalid credentials' });
        return;
      }
      res.status(200).json({ message: 'Login successful', user });
    } catch {
      res.status(500).json({ message: 'Server error during login.' });
    }
  }
}
