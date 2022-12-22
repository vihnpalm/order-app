import { Controller, Get, Param, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import { EventPattern } from '@nestjs/microservices';
import { Order } from './interfaces/order.interface';
    
@Controller('order')
export class OrderController {
    
  constructor(private orderService: OrderService) { }
    
  // Create an order
  @Post('/create')
  createOrder(@Body() body: CreateOrderDTO): Promise<Order> {
    return this.orderService.createOrder(body)
  }
    
  // Check a particular order status using ID
  @Get('check/:id')
  checkOrder(@Param('id', new ValidateObjectId()) orderID: string) {
    return this.orderService.checkOrder(orderID);
  }
    
  // Cancel an order using ID
  @Put('cancel/:id')
  async cancelOrder(@Param('id', new ValidateObjectId()) orderID: string) {
    return this.orderService.cancelOrder(orderID);
  }

  @EventPattern('order_confirmed')
  confirmOrder(order: CreateOrderDTO) {
    return this.orderService.confirmOrder(order);
  }

  @EventPattern('order_declined')
  declineOrder(order: CreateOrderDTO) {
    return this.orderService.declineOrder(order);
  }
}