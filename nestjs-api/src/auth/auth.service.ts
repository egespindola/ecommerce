import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

const usrs = [
  {
    id: 100,
    username: 'john',
    password: 'doe'
  }
];

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}
  //   async validateUser(username: string, password: string): Promise<any> {}

  login(username: string, password: string): any {
    const user = usrs.find(
      (usr) => usr.username === username && usr.password === password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
