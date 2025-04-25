import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { config } from 'src/config/env.config';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentIntentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(config.stripe.key);
  }

  //creating payment intent
  async createPaymentIntent(amount: number, metadata: Record<string, any>) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to cents
        currency: 'usd',
        metadata,
      });

      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException(
        'Stripe Payment Intent creation failed',
      );
    }
  }

  async verifyPaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new InternalServerErrorException(
        'Stripe Payment Intent verification failed',
      );
    }
  }
}
