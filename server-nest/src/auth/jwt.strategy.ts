import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'tu_secreto_jwt_aqui',
    });
  }

  validate(payload: JwtPayload) {
    console.log('JWT Strategy - Payload recibido:', payload);
    console.log('JWT Strategy - sub (userId):', payload.sub);
    return { userId: payload.sub, email: payload.email };
  }
}
