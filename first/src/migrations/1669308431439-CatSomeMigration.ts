import { MigrationInterface, QueryRunner } from 'typeorm';

export class CatSomeMigration1669308431439 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cat" RENAME COLUMN "name" to "title"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cat" RENAME COLUMN "title" to "name"`,
    );
  }
}
