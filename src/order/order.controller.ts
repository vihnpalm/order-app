import { Controller, Get, Param, NotFoundException, Post, Body, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';
import { EventPattern } from '@nestjs/microservices';
    
@Controller('order')
export class OrderController {
    
  constructor(private orderService: OrderService) { }
    
  // Create an order
  @Post('/create')
  createOrder(@Body() body: CreateOrderDTO) {
    return this.orderService.createOrder(body)
  }
    
  // Check a particular order status using ID
  @Get('check/:orderID')
  async checkOrder(@Param('orderID', new ValidateObjectId()) orderID: string) {
    const order = await this.orderService.checkOrder(orderID);
    if (!order) {
        throw new NotFoundException('Order does not exist!');
    }
    return order.state;
  }
    
  // Cancel an order using ID
  @Put('cancel/:orderID')
  async cancelOrder(@Param('orderID', new ValidateObjectId()) orderID: string) {
    const canceledOrder = await this.orderService.cancelOrder(orderID);
    if (!canceledOrder) {
        throw new NotFoundException('Order does not exist!');
    }
    return canceledOrder;
  }

  @EventPattern('order_confirmed')
  async confirmOrder(order: CreateOrderDTO) {
    const confirmedOrder = await this.orderService.confirmOrder(order);
    if (!confirmedOrder) {
        throw new NotFoundException('Order does not exist!');
    }
    return confirmedOrder;
  }

  @EventPattern('order_declined')
  async declineOrder(order: CreateOrderDTO) {
    const declinedOrder = await this.orderService.declineOrder(order);
    if (!declinedOrder) {
        throw new NotFoundException('Order does not exist!');
    }
    return declinedOrder;
  }
}