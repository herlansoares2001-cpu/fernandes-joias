import { Injectable, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CheckoutDto } from './dto/checkout.dto';

@Injectable()
export class CheckoutService {
  private readonly logger = new Logger(CheckoutService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async processCheckout(dto: CheckoutDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('Sacola de compras está vazia.');
    }

    // 1. Ensure a default guest user and address exist (Prisma foreign key constraints)
    const user = await this.prisma.user.upsert({
      where: { email: 'guest@fernandesjoias.com' },
      update: {},
      create: {
        email: 'guest@fernandesjoias.com',
        password: 'secure_password_hash',
        role: 'GUEST',
      },
    });

    const address = await this.prisma.address.findFirst({
      where: { userId: user.id },
    }) || await this.prisma.address.create({
      data: {
        userId: user.id,
        street: 'Avenida da Lapidação, 1000',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01000-000',
        country: 'Brasil',
        isDefault: true,
      },
    });

    // Check for idempotency if key is provided
    if (dto.idempotencyKey) {
      const existingOrder = await this.prisma.order.findUnique({
        where: { idempotencyKey: dto.idempotencyKey },
        include: { items: true },
      });
      if (existingOrder) {
        this.logger.log(`Idempotent request matched order ${existingOrder.id}`);
        return {
          success: true,
          orderId: existingOrder.id,
          totalAmount: Number(existingOrder.totalAmount),
          itemsCount: existingOrder.items.length,
        };
      }
    }

    const acquiredLocks: { sku: string; token: string }[] = [];

    try {
      // 2. Acquire Redis distributed lock for each SKU with ownership token
      for (const item of dto.items) {
        const token = await this.redis.acquireCheckoutLock(item.sku, 900);
        if (!token) {
          throw new ConflictException(`Item ${item.sku} já está sendo reservado por outro cliente.`);
        }
        acquiredLocks.push({ sku: item.sku, token });
      }

      // 3. Atomically check stock, adjust quantities, and create the order
      const resultOrder = await this.prisma.$transaction(async (tx) => {
        let calculatedTotal = 0;
        const orderItemsData = [];

        for (const item of dto.items) {
          // Find variant and its inventory
          const variant = await tx.variant.findUnique({
            where: { sku: item.sku },
            include: { product: true, inventory: true },
          });

          if (!variant) {
            throw new BadRequestException(`Variação ${item.sku} não existe.`);
          }

          const inventory = variant.inventory;
          const available = inventory ? inventory.quantityAvailable : 0;

          if (available < item.quantity) {
            throw new BadRequestException(`Estoque insuficiente para a joia SKU ${item.sku}.`);
          }

          // Decrement available and increment reserved
          await tx.inventory.update({
            where: { sku: item.sku },
            data: {
              quantityAvailable: { decrement: item.quantity },
              quantityReserved: { increment: item.quantity },
            },
          });

          // Calculate server-side price (FALHA 7 protection)
          const basePrice = Number(variant.product.basePrice);
          const priceAdjustment = Number(variant.priceAdjustment);
          const engravingCost = item.engravingText ? item.engravingText.length * 10 : 0;
          const unitPrice = basePrice + priceAdjustment + engravingCost;
          calculatedTotal += unitPrice * item.quantity;

          orderItemsData.push({
            variantSku: item.sku,
            quantity: item.quantity,
            unitPrice: unitPrice,
            engravingText: item.engravingText || null,
          });
        }

        // Create the order in db
        return tx.order.create({
          data: {
            userId: user.id,
            shippingAddressId: address.id,
            totalAmount: calculatedTotal,
            idempotencyKey: dto.idempotencyKey || null,
            status: 'PAID', // mark as paid (simulated gateway approval)
            items: {
              create: orderItemsData,
            },
          },
          include: {
            items: true,
          },
        });
      });

      return {
        success: true,
        orderId: resultOrder.id,
        totalAmount: Number(resultOrder.totalAmount),
        itemsCount: resultOrder.items.length,
      };

    } finally {
      // 4. Release all acquired locks
      for (const lock of acquiredLocks) {
        await this.redis.releaseCheckoutLock(lock.sku, lock.token);
      }
    }
  }
}
