import { Document } from 'mongoose';
    
export interface OrderInterface extends Document {
  product: string;
  productToken: string; // token given per request to purchase
  card: number; //payment card
  amount: number;
  address: string;
  state: string; //order state
  _id: string;
}