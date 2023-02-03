import { registerAs } from '@nestjs/config';

export const catsConfig = registerAs(
  'cats',
  () =>
    ({
      some: 'cat',
      other: 'pussy',
    } as const),
);
