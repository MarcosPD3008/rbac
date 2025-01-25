import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultValues1737824544992 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const permissions = [
            { name: 'Users.Create', description: 'Permission to create users' },
            { name: 'Users.Read', description: 'Permission to read users' },
            { name: 'Users.Update', description: 'Permission to update users' },
            { name: 'Users.Delete', description: 'Permission to delete users' },
            { name: 'Roles.Create', description: 'Permission to create roles' },
            { name: 'Roles.Read', description: 'Permission to read roles' },
            { name: 'Roles.Update', description: 'Permission to update roles' },
            { name: 'Roles.Delete', description: 'Permission to delete roles' },
            { name: 'Permissions.Create', description: 'Permission to create permissions' },
            { name: 'Permissions.Read', description: 'Permission to read permissions' },
            { name: 'Permissions.Update', description: 'Permission to update permissions' },
            { name: 'Permissions.Delete', description: 'Permission to delete permissions' },
        ];

        for (const permission of permissions) {
            await queryRunner.query(
                `INSERT INTO permissions (id, name, description, "createdAt", "updatedAt") VALUES (uuid_generate_v4(), $1, $2, now(), now())`,
                [permission.name, permission.description]
            );
        }

        const adminRoleId = '00000000-0000-0000-0000-000000000001';
        await queryRunner.query(
            `INSERT INTO roles (id, name, "createdAt", "updatedAt") VALUES ($1, 'Admin', now(), now())`,
            [adminRoleId]
        );

        const permissionRecords = await queryRunner.query(`SELECT id FROM permissions`);
        for (const permission of permissionRecords) {
            await queryRunner.query(
                `INSERT INTO roles_permissions_permissions (rolesId, permissionsId) VALUES ($1, $2)`,
                [adminRoleId, permission.id]
            );
        }

        const adminUserId = '00000000-0000-0000-0000-000000000001';
        const hashedPassword = '$argon2id$v=19$m=65536,t=3,p=4$LjdaiWQb/E3OlErwE2q+sQ$ZmzjqMcV6b/zWyKN6bPpgGGUmx3O6e6y8ZxZ5MPgmVk'; // Example hashed password for "admin123"
        await queryRunner.query(
            `INSERT INTO users (id, username, email, password, "createdAt", "updatedAt") VALUES ($1, 'admin', 'admin@example.com', $2, now(), now())`,
            [adminUserId, hashedPassword]
        );

        await queryRunner.query(
            `INSERT INTO users_roles_roles (usersId, rolesId) VALUES ($1, $2)`,
            [adminUserId, adminRoleId]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM users_roles_roles WHERE usersId = '00000000-0000-0000-0000-000000000001'`);
        await queryRunner.query(`DELETE FROM roles_permissions_permissions WHERE rolesId = '00000000-0000-0000-0000-000000000001'`);
        await queryRunner.query(`DELETE FROM users WHERE id = '00000000-0000-0000-0000-000000000001'`);
        await queryRunner.query(`DELETE FROM roles WHERE id = '00000000-0000-0000-0000-000000000001'`);

        await queryRunner.query(`DELETE FROM permissions WHERE name IN (
            'Users.Create', 'Users.Read', 'Users.Update', 'Users.Delete',
            'Roles.Create', 'Roles.Read', 'Roles.Update', 'Roles.Delete',
            'Permissions.Create', 'Permissions.Read', 'Permissions.Update', 'Permissions.Delete'
        )`);
    }
}
