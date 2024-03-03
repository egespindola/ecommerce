import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  image_url: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
