import { DataSource } from 'typeorm';
import { Permission } from 'src/modules/permissions/permissions.entity';
import { Role } from 'src/modules/roles/roles.entity';
import { User } from 'src/modules/users/users.entity';
import * as bcrypt from 'bcrypt';
import AppDataSource from './database.providers';

// List of permissions extracted from JSON
const permissionsData = [
  { name: "Users.Create", description: "Enable Create Users" },
  { name: "Users.Read", description: "Enable Read Users" },
  { name: "Users.Update", description: "Enable Update Users" },
  { name: "Users.Delete", description: "Enable Delete Users" },
  { name: "Roles.Create", description: "Enable Create Roles" },
  { name: "Roles.Read", description: "Enable Read Roles" },
  { name: "Roles.Update", description: "Enable Update Roles" },
  { name: "Roles.Delete", description: "Enable Delete Roles" },
  { name: "Permissions.Create", description: "Enable Create Permissions" },
  { name: "Permissions.Read", description: "Enable Read Permissions" },
  { name: "Permissions.Update", description: "Enable Update Permissions" },
  { name: "Permissions.Delete", description: "Enable Delete Permissions" }
];

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Seeding database...');

  const permissionRepository = dataSource.getRepository(Permission);
  const roleRepository = dataSource.getRepository(Role);
  const userRepository = dataSource.getRepository(User);

  // 1️⃣ Insert permissions if they don't exist
  for (const permissionData of permissionsData) {
    let permission = await permissionRepository.findOne({ where: { name: permissionData.name } });
    if (!permission) {
      permission = permissionRepository.create(permissionData);
      await permissionRepository.save(permission);
    }
  }

  console.log('✅ Permissions seeded.');

  // 2️⃣ Create Admin Role
  let adminRole = await roleRepository.findOne({ where: { name: 'Admin' } });
  if (!adminRole) {
    adminRole = roleRepository.create({ name: 'Admin' });
    adminRole.permissions = await permissionRepository.find();
    await roleRepository.save(adminRole);
  }

  console.log('✅ Admin role seeded.');

  // 3️⃣ Create Admin User
  let adminUser = await userRepository.findOne({ where: { email: 'admin@example.com' } });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    adminUser = userRepository.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isActive: true,
      roles: [adminRole],
    });
    await userRepository.save(adminUser);
  }

  console.log('✅ Admin user seeded.');
  console.log('🎉 Database seeding completed.');
}

const run = async () => {
    AppDataSource.initialize()
      .then(async () => {
        await seedDatabase(AppDataSource);
        await AppDataSource.destroy();
    })
    .catch((error) => console.log('❌ Error seeding database:', error));
}

run();
