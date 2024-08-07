import { MigrationInterface, QueryRunner } from 'typeorm';

export class GithubUsers1681631275392 implements MigrationInterface {
  name = 'GithubUsers1681631275392';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "github_users" (
      "id" bigint NOT NULL,
      "name" character varying(60) NOT NULL,
      "displayName" character varying(60),
      "avatar" character varying(128),
      "gravatarId" character varying(128),
      "accessToken" character varying(128),
      "refreshToken" character varying(128),
      "scopes" character varying(128),
      "tokenExpires" TIMESTAMP WITH TIME ZONE,
      "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "userId" uuid,
      CONSTRAINT "PK_08f611f0deb6dec9299cbc8224a" PRIMARY KEY ("id")
    )`);
    await queryRunner.query(
      `ALTER TABLE "github_users"
        ADD CONSTRAINT "FK_a99965459e40e9afc2e30bd6975" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "github_users" DROP CONSTRAINT "FK_a99965459e40e9afc2e30bd6975"`,
    );
    await queryRunner.query(`DROP TABLE "github_users"`);
  }
}
