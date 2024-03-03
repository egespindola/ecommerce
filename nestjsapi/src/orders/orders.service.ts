import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { ProductEntity } from '../product/entities/product.entity';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
    private amqpConnection: AmqpConnection,
  ) {}
  async create(createOrderDto: CreateOrderDto & { customer_id: number }) {
    const productIds = createOrderDto.items.map((it) => it.product_id);

    const uniqueProductIds = [...new Set(productIds)];

    const products = await this.productRepo.findBy({
      id: In(uniqueProductIds)
    });

    if (products.length !== uniqueProductIds.length) {
      throw new Error(
        `Some of the following products do not exist: \n Passed products: ${productIds} \nFound products: ${products.map((p) => p.id)}`,
      );
    }

    console.debug('\n createOrderDto: ', createOrderDto);
    const order = OrderEntity.create({
      customer_id: createOrderDto.customer_id,
      items: createOrderDto.items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);
        return {
          price: product.price,
          product_id: item.product_id,
          quantity: item.quantity,
        };
      })
    });

    await this.orderRepo.save(order);
    const orderObj = {
      order_id: order.id,
      card_hash: createOrderDto.card_hash,
      total: order.total
    };
    this.amqpConnection.publish('amq.direct', 'OrderCreated', orderObj);

    return order;
  }

  async findAll(customer_id: number): Promise<OrderEntity[]> {
    const findOpt: FindManyOptions = {
      where: {
        customer_id
      },
      order: {
        created_at: 'DESC'
      },
    };
    return this.orderRepo.find(findOpt);
  }

  async findOne(id: string, customer_id: number): Promise<OrderEntity> {
    try {
      const findOpt: FindOneOptions<OrderEntity> = {
        where: {
          id,
          customer_id
        },
      };
      const entity: OrderEntity = await this.orderRepo.findOne(findOpt);

      if (!entity)
        throw new HttpException(
          `Entidade ${id} nao encontrada`,
          HttpStatus.NOT_FOUND,
        );

      return entity;
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
