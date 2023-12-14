const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      username: 'ejemploUsuario',
      password: 'contraseñaSegura',
      posts: {
        create: {
          title: 'Título del post',
          content: 'Contenido del post',
        },
      },
    },
  });
  console.log('Usuario creado con ID:', user.id);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
