import { Controller, Get, Param } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';

@Controller('currency')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll() {
    return this.currenciesService.findAll();
  }

  @Get(':from/:to')
  getRateExchange(
    @Param('from') from: string,
    @Param('to') to: string,
  ) {
    return this.currenciesService.getRateExchange(from, to);
  }

  @Get(':from/:to/:amount')
  getRateExhcangeWithAmount(
    @Param('from') from: string,
    @Param('to') to: string,
    @Param('amount') amount: number,
  ) {
    return this.currenciesService.getRateExchange(from, to, amount);
  }
}
