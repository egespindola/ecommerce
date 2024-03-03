import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    RabbitMQModule.forRoot(RabbitMQModule, {
      uri: 'amqp://admin:admin@localhost:5672'
      // uri: process.env.RABBITMQ_URL
    }),
  ],
  exports: [RabbitMQModule],
})
export class RabbitmqModule {}
