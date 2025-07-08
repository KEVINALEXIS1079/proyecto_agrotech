import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1751708209772 implements MigrationInterface {
    name = 'InitialMigration1751708209772'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lotes" ("id_lote_pk" SERIAL NOT NULL, "area_lote" double precision NOT NULL, "delete_at" TIMESTAMP, CONSTRAINT "PK_f6bfac2ebd5dbe95bab0ca34459" PRIMARY KEY ("id_lote_pk"))`);
        await queryRunner.query(`CREATE TABLE "sublotes" ("id_sublote_pk" SERIAL NOT NULL, "latitud_sublote" double precision NOT NULL, "longitud_sublote" double precision NOT NULL, "nombre_sublote" character varying(100) NOT NULL, "descripcion_sublote" text NOT NULL, "delete_at" TIMESTAMP, "id_lote_fk" integer, CONSTRAINT "PK_d2a5417c33aac839f3cc27cd0a3" PRIMARY KEY ("id_sublote_pk"))`);
        await queryRunner.query(`CREATE TABLE "cultivos" ("id_cultivo_pk" SERIAL NOT NULL, "descripcion_cultivo" character varying NOT NULL, "precio_cultivo" numeric(10,2) NOT NULL, "presentacion_cultivo" character varying NOT NULL, "fecha_inicio_cultivo" date NOT NULL, "fecha_fin_cultivo" date NOT NULL, "delete_at" TIMESTAMP, "id_sublote_fk" integer, "id_tipo_cultivo_fk" integer, CONSTRAINT "PK_2decac61e351bcd313e157edccb" PRIMARY KEY ("id_cultivo_pk"))`);
        await queryRunner.query(`CREATE TABLE "tipo_cultivo" ("id_tipo_cultivo_pk" SERIAL NOT NULL, "nombre_tipo_cultivo" character varying(100) NOT NULL, "delete_at" TIMESTAMP, CONSTRAINT "PK_261f612863d39db0e520ba1ff6a" PRIMARY KEY ("id_tipo_cultivo_pk"))`);
        await queryRunner.query(`ALTER TABLE "sublotes" ADD CONSTRAINT "FK_7fa4d87973296c82ce5e65698b9" FOREIGN KEY ("id_lote_fk") REFERENCES "lotes"("id_lote_pk") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos" ADD CONSTRAINT "FK_dcd6228d8fcd8ea17bca2814b90" FOREIGN KEY ("id_sublote_fk") REFERENCES "sublotes"("id_sublote_pk") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cultivos" ADD CONSTRAINT "FK_f32e41704676603d6cc6d31d229" FOREIGN KEY ("id_tipo_cultivo_fk") REFERENCES "tipo_cultivo"("id_tipo_cultivo_pk") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_f32e41704676603d6cc6d31d229"`);
        await queryRunner.query(`ALTER TABLE "cultivos" DROP CONSTRAINT "FK_dcd6228d8fcd8ea17bca2814b90"`);
        await queryRunner.query(`ALTER TABLE "sublotes" DROP CONSTRAINT "FK_7fa4d87973296c82ce5e65698b9"`);
        await queryRunner.query(`DROP TABLE "tipo_cultivo"`);
        await queryRunner.query(`DROP TABLE "cultivos"`);
        await queryRunner.query(`DROP TABLE "sublotes"`);
        await queryRunner.query(`DROP TABLE "lotes"`);
    }

}
