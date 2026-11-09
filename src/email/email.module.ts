import { Module, Global } from '@nestjs/common';
import { EmailService } from './email.service.js';
import { EmailController } from './email.controller.js';

@Global()
@Module({
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService]
})
export class EmailModule {}
