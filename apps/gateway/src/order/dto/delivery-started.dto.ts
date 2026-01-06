import { IsNotEmpty, IsString } from 'class-validator';

export class DeliveryStarted {
  @IsString()
  @IsNotEmpty()
  id: string;
}
