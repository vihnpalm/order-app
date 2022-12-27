import { Controller, Get, Param, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import { EventPattern } from '@nestjs/microservices';
import { OrderInterface } from './interfaces/order.interface';
    
@Controller('order')
export class OrderController {
    
  constructor(private orderService: OrderService) { }
    
  // Create an order
  @Post('/create')
  createOrder(@Body() body: CreateOrderDTO): Promise<OrderInterface> {
    return this.orderService.create(body)
  }
    
  // Check a particular order status using ID
  @Get('check/:id')
  checkOrder(@Param('id', new ValidateObjectId()) id: string) {
    return this.orderService.check(id);
  }
    
  // Cancel an order using ID
  @Put('cancel/:id')
  cancelOrder(@Param('id', new ValidateObjectId()) id: string) {
    return this.orderService.cancel(id);
  }

  @EventPattern('order_confirmed')
  confirmOrder(id: string) {
    return this.orderService.confirm(id);
  }

  @EventPattern('order_declined')
  declineOrder(id: string) {
    return this.orderService.decline(id);
  }
}