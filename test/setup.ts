import { rm } from 'fs/promises';
import { join } from 'path';

global.afterAll(async () => {
  try {
    // console.log(join(__dirname, '..', 'test.sqlite'));
    // await rm(join(__dirname, '..', 'test.sqlite'));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // do nothing
  }
});
