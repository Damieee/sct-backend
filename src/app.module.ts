import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { CoWorkingSpacesModule } from './co-working-spaces/co-working-spaces.module';
import { StartupsModule } from './startups/startups.module';
import { NewsArticlesModule } from './news-articles/news-articles.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { FilesModule } from './files/files.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
        EMAIL_JS_SERVICE_KEY: Joi.string().required(),
        EMAIL_JS_PASSWORD_RESET_TEMPLATE_ID: Joi.string().required(),
        EMAIL_JS_PUBLIC_KEY: Joi.string().required(),
        EMAIL_JS_PRIVATE_KEY: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        OPENAI_API_KEY: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST') || '127.0.0.1' || 'db',
          port: configService.get('POSTGRES_PORT') || 3306,
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          url:
            process.env.NODE_ENV === 'production'
              ? configService.get('POSTGRES_URL')
              : undefined,
          synchronize: true,
          autoLoadEntities: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
            sslmode: 'require',
          },
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    EventsModule,
    CoWorkingSpacesModule,
    StartupsModule,
    NewsArticlesModule,
    OrganizationsModule,
    SharedModule,
    AuthModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
