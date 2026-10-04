import { prisma } from "@/app/lib/prisma";

export async function createAdminUser(username: string, password: string) {
  try {
    const adminUser = await prisma.user.create({
      data: {
        username,
        password,
        role: "ADMIN",
      },
    });

    console.log(`Admin user created: ${adminUser.username}`);
    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

export async function makeUserAdmin(username: string) {
  try {
    const user = await prisma.user.update({
      where: { username },
      data: { role: "ADMIN" },
    });

    console.log(`User ${username} is now an admin`);
    return user;
  } catch (error) {
    console.error("Error making user admin:", error);
    throw error;
  }
}
