import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <html>
        <body>
          <h1>Hello Developer!</h1>
          <h2>View Documentation Via: <a href="/api-docs/">API Docs</a></h2>
        </body>
      </html>
    `;
  }
}
