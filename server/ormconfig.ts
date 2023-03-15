import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

function buildConnectionOptions(filePath): TypeOrmModuleOptions {

  let data: any = process.env;

  if (fs.existsSync(filePath)) {
    data = { ...data, ...dotenv.parse(fs.readFileSync(filePath)) };
  }

  console.log(data)

  return {
    type: 'postgres',
    host: data.PG_HOST,
    port: data.PG_PORT,
    username: data.PG_USER,
    password: data.PG_PASS,
    database: data.PG_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
  }

}


export function determineFilePathForEnv(env: string | undefined): string {
  if (env === 'test') {
    return path.resolve(process.cwd(), '../.env.test');
  } else if (env === "prod") {
    return path.resolve(process.cwd(), '.env');
  } else {
    return path.resolve(process.cwd(), '../.env');
  }
}

function fetchConnectionOptions(): TypeOrmModuleOptions {
  const env: string | undefined = process.env.NODE_ENV;
  const filePath: string = determineFilePathForEnv(env);

  return buildConnectionOptions(filePath);
}

export const typeOrmConfig: TypeOrmModuleOptions = fetchConnectionOptions();
