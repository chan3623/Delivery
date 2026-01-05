import { Column, Entity } from 'typeorm';

export enum PaymentStatus {
  pending = 'Pending',
  rejected = 'Rejected',
  approved = 'Approved',
}

export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakao = 'Kakao',
}

export enum NotificationStatus {
  pending = 'Pending',
  sent = 'Sent',
}

@Entity()
export class Payment {
  id: string;

  @Column({
    enum: PaymentStatus,
    default: PaymentStatus.pending,
  })
  paymentStatus: PaymentStatus;

  @Column({
    enum: PaymentMethod,
    default: PaymentMethod.creditCard,
  })
  paymentMethod: PaymentMethod;

  @Column()
  cardNumber: string;

  @Column()
  expireYear: string;

  @Column()
  expireMonth: string;

  @Column()
  birthOrRegistration: string;

  @Column()
  passwordTwoDigits: string;

  @Column({
    enum: NotificationStatus,
    default: NotificationStatus.pending,
  })
  notificationStatus: NotificationStatus;
}
