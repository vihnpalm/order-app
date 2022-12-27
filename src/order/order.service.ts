import { ConflictException, ForbiddenException, Inject, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderInterface } from './interfaces/order.interface';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ExistedOrderDTO } from './dtos/existed-order.dto';
import { empty } from 'rxjs';
    
@Injectable()
export class OrderService {
  constructor(
    @Inject('STATUS') private readonly statusClient: ClientProxy,
    @InjectModel('Order') private readonly repo: Model<OrderInterface>) {}
    
  create(order: CreateOrderDTO): Promise<OrderInterface> {
    order.state=`Order created`
    const newOrder = new this.repo(order);
    this.verify(newOrder);
    this.statusClient.emit('order_created',newOrder)
    return newOrder.save()
  }

  async findByProductToken(productToken: string): Promise<OrderInterface | null> {
    return this.repo.findOne({productToken}).exec();
  }

  async verify(order: CreateOrderDTO): Promise<OrderInterface | any> {
    try{
      const {productToken} = order;
      const existedUser = await this.findByProductToken(productToken);
      if(existedUser.productToken==order.productToken) throw new NotAcceptableException('Duplicate order'); //cannot create duplicate orders
      if (order.amount<1 || order.amount%1!=0) throw new NotAcceptableException('Invalid amount'); //amount has to be positive and whole number
      if (order.card?.toString().length!=16) throw new NotAcceptableException('Invalid card'); //card number has to be 16 digits
      return order;
    } catch(err) {
      console.log(err);
    }
  }

  check(id: string): Promise<OrderInterface> {
    return this.repo.findById(id).exec();
  }

  async cancel(id: string): Promise<OrderInterface> {
    const canceledOrder = await this.repo.findById(id).exec();
    if(canceledOrder.state==`Order delivered` || canceledOrder.state==`Order canceled`) throw new ForbiddenException('Order already processed, cannot cancel!');
    canceledOrder.state=`Order canceled`
    return canceledOrder.save();
  }

  async confirm(id: string): Promise<OrderInterface> {
    const confirmedOrder = await this.repo.findById(id).exec();
    confirmedOrder.state=`Order delivered`
    return confirmedOrder.save();
  }

  async decline(id: string): Promise<OrderInterface> {
    const declinedOrder = await this.repo.findById(id).exec();
    declinedOrder.state=`Order declined` 
    return declinedOrder.save();
  }
}
