import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { Status } from './enums/status.enum';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://test.secondarycity.tech',
      'http://localhost:3001', // Common frontend dev port
      'http://localhost:5173', // Vite dev server
      'http://localhost:8080', // Common alternative port
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma',
    ],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
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
    enum: ['pending', 'published', 'Not Accepted'],
    description: 'The status of the item',
  };
  app.use(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
      content: document,
    }),
  );
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
