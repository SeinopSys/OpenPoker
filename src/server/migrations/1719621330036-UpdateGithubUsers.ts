import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGithubUsers1719621330036 implements MigrationInterface {
  name = 'UpdateGithubUsers1719621330036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "github_users" DROP CONSTRAINT "FK_a99965459e40e9afc2e30bd6975"`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "name" SET DATA TYPE character varying(32)`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "displayName" SET DATA TYPE character varying(32)`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "avatar" SET DATA TYPE character varying(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "gravatarId" SET DATA TYPE character varying(64)`,
    );
    await queryRunner.query(`ALTER TABLE "github_users"
      ADD CONSTRAINT "FK_732e8d218c2cecf48f6d9ae61fa" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "github_users" DROP CONSTRAINT "FK_732e8d218c2cecf48f6d9ae61fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "gravatarId" SET DATA TYPE character varying(128)`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "avatar" SET DATA TYPE character varying(128)`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "displayName" SET DATA TYPE character varying(60)`,
    );
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ALTER COLUMN "name" SET DATA TYPE character varying(60)`,
    );
    await queryRunner.query(`ALTER TABLE "github_users"
      ADD CONSTRAINT "FK_a99965459e40e9afc2e30bd6975" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }
}
