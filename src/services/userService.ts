import { UserRepository } from '../repositories/userRepository';

const userRepo = new UserRepository();

export class UserService {
  async findUserByEmail(email: string) {
    return userRepo.findByEmail(email);
  }

  async findUserByUserName(username:string){
    return userRepo.findByUserName(username)
  }

  async createUser(username: string, email: string, password: string) {
    return userRepo.create(username, email, password);
  }
}
