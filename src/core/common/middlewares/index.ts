import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { ForbiddenErrorException } from '../filters/error-exceptions';
import { config } from 'src/config/env.config';

export const verifyTokens = ({
  secret,
  token,
}: {
  secret: string;
  token: string;
}) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, function (err: Error, decoded: any) {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

interface CustomRequest extends Request {
  user?: { id: string };
}

@Injectable()
export class VerifyTokenMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const accessToken = req.headers['jwt'] as string;

    verifyTokens({
      token: accessToken,
      secret: config.jwt.secret as string,
    })
      .then((decoded) => {
        const user = {
          id: decoded['id'],
          user_type: decoded['user_type'],
        };
        req.user = user;
        next();
      })
      .catch(() => {
        res
          .status(401)
          .json(
            new ForbiddenErrorException(
              'Your access token is either expired or invalid',
            ).getResponse(),
          );
      });
  }
}
