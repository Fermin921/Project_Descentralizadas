import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

  // Usar ValidationPipe para validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Puerto de la aplicación
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  // Log para confirmar que el servidor está corriendo
  console.log(`Servidor corriendo en http://localhost:${port}`);
}
bootstrap();
