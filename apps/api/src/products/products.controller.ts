import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { plainToInstance } from 'class-transformer';
import { ProductResponseDto } from './dto/product-response.dto';
import { EngravingDto } from './dto/engraving.dto';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    const products = await this.productsService.findAll();
    return plainToInstance(ProductResponseDto, products, { excludeExtraneousValues: true });
  }

  @Get(':slug')
  async getProduct(@Param('slug') slug: string) {
    const product = await this.productsService.findOne(slug);
    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }

  @Post('engraving')
  async calculateEngraving(@Body() body: EngravingDto) {
    const totalCost = await this.productsService.calculateCustomEngraving(body.sku, body.text);
    return {
      success: true,
      data: {
        totalCost,
      },
    };
  }
}
