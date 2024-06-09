import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const PORT = process.env.PORT || 5000; // 4001 - dev, 4000 - prod
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Todo List')
    .setDescription('The Todo List API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/docs", app, document);
  
  app.useGlobalPipes(new ValidationPipe());
 
  await app.listen(PORT, () => {
      console.log(`Server started on port = ${PORT}`);
  })
}

start()
