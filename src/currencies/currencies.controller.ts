import { Controller, Get, Param, Query } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';

@Controller('currency')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll(@Query('name') nameFilter: string) {
    return this.currenciesService.findAll(nameFilter);
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
