import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);

      return { ...product, images };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    // eager: true carga automáticamente las imágenes
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // ✨ No necesitas esto: relations: { images: true }
    });

    return products.map((product) => ({
      ...product,
      images: product.images?.map((img) => img.url) || [],
    }));
  }

  async findOne(term: string) {
    const product = isUUID(term)
      ? await this.productRepository.findOne({ where: { id: term } })
      : await this.productRepository.findOne({ where: { slug: term } });

    if (!product)
      throw new NotFoundException(`Product with term "${term}" not found`);

    // Como eager: true ya carga las imágenes,
    // product.images ya viene poblado automáticamente
    return {
      ...product,
      images: product.images?.map((img) => img.url) || [],
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...toUpdate });
    if (!product)
      throw new NotFoundException(`Product with id: ${id} not found`);

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });

        product.images = images.map((image) =>
          this.productImageRepository.create({ url: image }),
        );
      } else {
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    await this.productRepository.remove(product);
  }

  private handleDBExceptions(error: any): never {
    const code = error?.code ?? error?.driverError?.code ?? error?.errno;

    const detail =
      error?.detail ?? error?.driverError?.detail ?? error?.message;

    if (code === '23505' || detail?.includes('duplicate key value')) {
      throw new BadRequestException(detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions;
    }
  }
}
