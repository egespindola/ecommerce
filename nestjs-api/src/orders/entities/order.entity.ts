import { OrderItemEntity } from './order-item.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

export enum EnumOrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export type CreateOrderCommand = {
  customer_id: number;
  items: {
    product_id: string;
    quantity: number;
    price: number;
  }[];
};

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column()
  customer_id: number; //authenticated user

  @Column()
  status: EnumOrderStatus = EnumOrderStatus.PENDING;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItemEntity, (item) => item.order, {
    cascade: ['insert', 'update', 'remove']
  })
  items: OrderItemEntity[];
  static create(input: CreateOrderCommand) {
    const order = new OrderEntity();
    order.customer_id = input.customer_id;
    order.items = input.items.map((item) => {
      const orderItem = new OrderItemEntity();
      orderItem.product_id = item.product_id;
      orderItem.quantity = item.quantity;
      orderItem.price = item.price;
      return orderItem;
    });

    order.total = input.items.reduce(
      (total, item) => total + item.quantity * item.price,
      0,
    );
    // order.status = EnumOrderStatus.PENDING;
    // order.created_at = new Date();
    return order;
  }
}

//anem or rich
