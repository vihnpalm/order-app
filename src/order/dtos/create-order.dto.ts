import { IsNumber, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  product: string;

  @IsString()
  address: string;

  @IsString()
  productToken: string; // token given per request to purchase

  @IsNumber()
  card: number; //payment card

  @IsNumber()
  amount: number;

  @IsString()
  state: string; // order state
}