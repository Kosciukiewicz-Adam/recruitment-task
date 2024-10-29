import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const whitelist = ['http://localhost:3000']

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: whitelist,
    allowedHeaders: "Content-Type",
    methods: "POST",
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
