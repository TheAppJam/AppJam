import { determineFilePathForEnv } from "ormconfig";
import * as fs from 'fs';
import * as dotenv from 'dotenv';

export default () => {
  const env: string | undefined = process.env.NODE_ENV;
  const filePath: string = determineFilePathForEnv(env);
  let data: any = process.env;

  if (fs.existsSync(filePath)) {
    data = { ...data, ...dotenv.parse(fs.readFileSync(filePath)) };
  }

  return ({
  appSecret: data.APP_SECRET
})}