import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return this.productsService.findAll();
  }

  @Get(':slug')
  async getProduct(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @Post('engraving')
  async calculateEngraving(@Body() body: { sku: string; text: string }) {
    const totalCost = await this.productsService.calculateCustomEngraving(body.sku, body.text);
    return {
      success: true,
      data: {
        totalCost,
      },
    };
  }
}
