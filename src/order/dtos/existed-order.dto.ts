import { IsNumber, IsString } from 'class-validator';

export class ExistedOrderDTO {
  @IsString()
  productToken: string; // token given per request to purchase

  @IsString()
  address: string;

  @IsString()
  product: string;

  @IsNumber()
  card: number; //payment card

  @IsNumber()
  amount: number;

  @IsString()
  _id: string;

  @IsString()
  state: string; // order state
}