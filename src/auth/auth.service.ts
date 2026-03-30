import { AuthToken } from './auth.types';
import { SigninInput } from './dto/signin.dto';
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupInput } from './dto/signup.dto.';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  JwtService,
  JwtSignOptions,
} from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  async signup(signupInput: SignupInput) {
    const hashPass = await argon2.hash(
      signupInput.password,
    );
    try {
      const user = await this.prisma.user.create({
        data: {
          email: signupInput.email,
          hash: hashPass,
        },
      });
      const tokenObj = await this.singinToken(
        user.id,
        user.email,
      );
      return {
        accessToken: tokenObj.accessToken,
        user: user,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ForbiddenException(
          'Credentials taken',
        );
      }
      throw error;
    }
  }

  async signin(signinInput: SigninInput) {
    const user =
      await this.prisma.user.findUnique({
        where: { email: signinInput.email },
      });
    if (!user) {
      throw new ForbiddenException(
        'Invalid credentials',
      );
    }
    const pwMatch = await argon2.verify(
      user.hash,
      signinInput.password,
    );
    if (!pwMatch) {
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }
    const tokenObj = await this.singinToken(
      user.id,
      user.email,
    );
    return {
      accessToken: tokenObj.accessToken,
      user: user,
    };
  }

  async singinToken(
    userId: number,
    email: string,
  ): Promise<AuthToken> {
    const payload = {
      sub: userId,
      email: email,
    };

    const jwtOptions: JwtSignOptions = {
      expiresIn: '15m',
      secret:
        this.config.get<string>('JWT_SECRET'),
    };

    if (!jwtOptions.secret) {
      throw new Error(
        'JWT secret is not defined',
      );
    }
    const token = await this.jwt.signAsync(
      payload,
      jwtOptions,
    );
    return { accessToken: token };
  }
}
