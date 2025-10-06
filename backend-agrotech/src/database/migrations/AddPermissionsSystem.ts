/*import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPermissionsSystem1751708209773 implements MigrationInterface {
    name = 'AddPermissionsSystem1751708209773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        //  Crear tabla de módulos de permisos
        await queryRunner.query(`
            CREATE TABLE "permisos_module" (
                "id" SERIAL NOT NULL,
                "nombre" character varying NOT NULL,
                CONSTRAINT "PK_permisos_module_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_permisos_module_nombre" UNIQUE ("nombre")
            )
        `);

        //  Crear tabla de permisos
        await queryRunner.query(`
            CREATE TABLE "permisos" (
                "id" SERIAL NOT NULL,
                "accion" character varying NOT NULL,
                "moduleId" integer,
                CONSTRAINT "PK_permisos_id" PRIMARY KEY ("id")
            )
        `);

        //  Crear tabla de relación entre roles y permisos
        await queryRunner.query(`
            CREATE TABLE "rol_permisos" (
                "rol_id" integer NOT NULL,
                "permiso_id" integer NOT NULL,
                CONSTRAINT "PK_rol_permisos" PRIMARY KEY ("rol_id", "permiso_id")
            )
        `);

        // Agregar foreign keys
        await queryRunner.query(`
            ALTER TABLE "permisos" 
            ADD CONSTRAINT "FK_permisos_module" 
            FOREIGN KEY ("moduleId") 
            REFERENCES "permisos_module"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "rol_permisos" 
            ADD CONSTRAINT "FK_rol_permisos_rol" 
            FOREIGN KEY ("rol_id") 
            REFERENCES "roles"("id") 
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "rol_permisos" 
            ADD CONSTRAINT "FK_rol_permisos_permiso" 
            FOREIGN KEY ("permiso_id") 
            REFERENCES "permisos"("id") 
            ON DELETE CASCADE
        `);

        // Insertar módulos principales
        const mainModules = [
            'actividad', 'cultivo', 'finanzas', 'fitosanitario', 
            'inventario', 'iot', 'usuario'
        ];

        for (const moduleName of mainModules) {
            await queryRunner.query(
                `INSERT INTO "permisos_module" ("nombre") VALUES ($1)`,
                [moduleName]
            );
        }

        //  Insertar submódulos
        const submodulesData = [
            { parent: 'actividad', submodules: ['actividades', 'cultivo-actividad', 'evidencias', 'tipo-actividad', 'usuario-actividad'] },
            { parent: 'cultivo', submodules: ['cultivos', 'lotes', 'sublotes', 'tipo-cultivo'] },
            { parent: 'finanzas', submodules: ['movimiento-producto', 'productos', 'ventas'] },
            { parent: 'fitosanitario', submodules: ['epsa', 'tipo-epsa'] },
            { parent: 'inventario', submodules: ['almacenes', 'categorías', 'insumo-proveedor', 'insumos', 'movimiento-insumo', 'proveedores'] },
            { parent: 'iot', submodules: ['sensores', 'tipo-sensor'] },
            { parent: 'usuario', submodules: ['roles', 'usuarios'] }
        ];

        for (const { parent, submodules } of submodulesData) {
            for (const sub of submodules) {
                const submoduleName = `${parent}:${sub}`;
                await queryRunner.query(
                    `INSERT INTO "permisos_module" ("nombre") VALUES ($1)`,
                    [submoduleName]
                );
            }
        }

        // Crear permisos CRUD para todos los módulos y submódulos
        const allModules = await queryRunner.query(`SELECT id, nombre FROM "permisos_module"`);
        const acciones = ['create', 'read', 'update', 'delete'];

        for (const module of allModules) {
            for (const accion of acciones) {
                await queryRunner.query(
                    `INSERT INTO "permisos" ("accion", "moduleId") VALUES ($1, $2)`,
                    [accion, module.id]
                );
            }
        }

        //Asignar todos los permisos al rol Administrador
        const adminRol = await queryRunner.query(`SELECT id FROM "roles" WHERE "nombre_rol" = 'Administrador'`);
        
        if (adminRol.length > 0) {
            const allPermissions = await queryRunner.query(`SELECT id FROM "permisos"`);
            const adminRolId = adminRol[0].id;

            for (const permission of allPermissions) {
                await queryRunner.query(
                    `INSERT INTO "rol_permisos" ("rol_id", "permiso_id") VALUES ($1, $2)`,
                    [adminRolId, permission.id]
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Eliminar en orden inverso
        await queryRunner.query(`ALTER TABLE "rol_permisos" DROP CONSTRAINT "FK_rol_permisos_permiso"`);
        await queryRunner.query(`ALTER TABLE "rol_permisos" DROP CONSTRAINT "FK_rol_permisos_rol"`);
        await queryRunner.query(`ALTER TABLE "permisos" DROP CONSTRAINT "FK_permisos_module"`);
        
        await queryRunner.query(`DROP TABLE "rol_permisos"`);
        await queryRunner.query(`DROP TABLE "permisos"`);
        await queryRunner.query(`DROP TABLE "permisos_module"`);
    }
}*/
