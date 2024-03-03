import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested
} from 'class-validator';

export class CreateOrderDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) //each for array
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @MaxLength(255, { message: 'card_hash must be lower than 256!' })
  @IsString({ message: 'card_hash must be a valid string!' })
  @IsNotEmpty({ message: 'card_hash cannot be empty!' })
  card_hash: string;
}

export class OrderItemDto {
  @IsPositive()
  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @MaxLength(36)
  @IsString()
  @IsNotEmpty()
  product_id: string;
}
