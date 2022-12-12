import { IsOptional, IsString } from 'class-validator';

export class CreateOrderDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  state: string;

  @IsString()
  _id: string;
}