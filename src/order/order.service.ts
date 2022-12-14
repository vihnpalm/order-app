import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './interfaces/order.interface';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
    
@Injectable()
export class OrderService {
  constructor(
    @Inject('STATUS') private readonly statusClient: ClientProxy,
    @InjectModel('Order') private readonly repo: Model<Order>
    ) {}
    
  createOrder(order: CreateOrderDTO): Promise<Order> {
    order.state=`Order created`
    const newOrder = new this.repo(order);
    this.statusClient.emit(
      'order_created',
      newOrder
    )
    return newOrder.save();
  }

  async checkOrder(orderID: string): Promise<Order> {
    const order = await this.repo
      .findById(orderID)
      .exec();
    return order;
  }

  async cancelOrder(orderID: string): Promise<Order> {
    const canceledOrder = await this.repo
      .findById(orderID)
      .exec();
      if(canceledOrder.state=`Order delivered`) {
        throw new NotFoundException('Order already delivered, cannot cancel!');
      }
      canceledOrder.state=`Order canceled`
    return canceledOrder.save();
  }

  async confirmOrder(order: CreateOrderDTO): Promise<Order> {
    const confirmedOrder = await this.repo
      .findById(order._id)
      .exec();
    return confirmedOrder.save();
  }

  async declineOrder(order: CreateOrderDTO): Promise<Order> {
    const declinedOrder = await this.repo
      .findById(order._id)
      .exec();
      declinedOrder.state=`Order declined` 
    return declinedOrder.save();
  }
}
