/*import * as mongoose from 'mongoose';
    
export const OrderSchema = new mongoose.Schema({
  productToken: String, // token given per request to purchase
  address: String,
  product: String,
  card: Number, //payment card
  amount: Number,
  state: String, //order state
});*/

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsNumber } from "class-validator";

@Schema()
export class Order {
  @Prop({ required: true })
  product: string;

  @Prop({ required: true })
  productToken: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  card: number;

  @Prop({ required: true })
  amount: number;

  @Prop()
  state: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order)