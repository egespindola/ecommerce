import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    const createProduct = this.productRepo.create(createProductDto);
    return await this.productRepo.save(createProduct);
  }

  async findAll() {
    return this.productRepo.find();
  }

  async findOne(id: any) {
    const findContitions: FindOneOptions<ProductEntity> = { where: { id } };
    const entity: ProductEntity =
      await this.productRepo.findOne(findContitions);

    if (!entity) throw new NotFoundException(`Entidade ${id} nao encontrada`);

    return entity;
  }

  update(id: any, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: any) {
    return `This action removes a #${id} product`;
  }
}
