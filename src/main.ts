import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Status } from './enums/status.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('SCT-BACKEND API Documentation')
    .setDescription('This is the Swagger UI of SCT-BACKEND API ')
    .setVersion('1.0')
    .addTag('Nestjs Swagger UI')
    .setContact('Dare Ezekiel', 'dami.josh', 'joshezekiel.dev@gmail.com')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addOAuth2({
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
          tokenUrl: 'https://oauth2.googleapis.com/token',
          scopes: {
            email: 'Access email',
            profile: 'Access user profile',
          },
        },
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Add the enum schema manually
  document.components.schemas['Status'] = {
    type: 'string',
    enum: Object.values(Status),
    description: 'The status of the item',
  };

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:3000/auth/google/callback',
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
    region: configService.get('AWS_REGION'),
  });

  await app.listen(3000);
}
bootstrap();
