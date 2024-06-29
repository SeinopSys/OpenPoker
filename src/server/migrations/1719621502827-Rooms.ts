import { MigrationInterface, QueryRunner } from 'typeorm';

export class Rooms1719621502827 implements MigrationInterface {
  name = 'Rooms1719621502827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "rooms"
                             (
                               "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
                               "name"       bytea                    NOT NULL,
                               "passphrase" bytea                    NOT NULL,
                               "createdAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                               "updatedAt"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                               "ownerId"    uuid,
                               CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`ALTER TABLE "rooms"
      ADD CONSTRAINT "FK_383ac461c63dd52c22ba73a6624" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "rooms"
      DROP CONSTRAINT "FK_383ac461c63dd52c22ba73a6624"`);
    await queryRunner.query(`DROP TABLE "rooms"`);
  }
}
