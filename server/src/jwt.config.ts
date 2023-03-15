import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import appConfig from './app.config';

export const jwtConfig: JwtModuleAsyncOptions = {
  useFactory: async () => {
    return {
      secret: appConfig().appSecret,
      signOptions: {
        expiresIn: '30d',
      },
    };
  },
};
