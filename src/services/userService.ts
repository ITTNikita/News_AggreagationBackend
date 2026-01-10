import { UserRepository } from '../repositories/userRepository';

const userRepo = new UserRepository();

export class UserService {

  constructor(private userRepo = new UserRepository()) {}

  async findUserByEmail(email: string) {
    return this.userRepo.findByEmail(email);
  }

  async findUserByUserName(username:string){
    return this.userRepo.findByUserName(username)
  }

  async createUser(username: string, email: string, password: string) {
    return this.userRepo.create(username, email, password);
  }
}
