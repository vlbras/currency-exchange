import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Currency } from './entities/currency.entity';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectRepository(Currency)
    private currenciesRepository: Repository<Currency>,
  ) {}

  findAll(name: string): Promise<Currency[]> {
    const query = this.currenciesRepository.createQueryBuilder('currency');

    if (name) {
      query.andWhere('currency.name = :name', { name: name.toUpperCase() });
    }
    
    return query.getMany();
  }

  async getRateExchange(from: string, to: string, amount?: number): Promise<number> {
    from = from.toUpperCase();
    to = to.toUpperCase();

    if (!amount) {
      amount = 1;
    }

    try {
      const result = await this.convertCurrency(from, to, amount);

      await this.createOne(from);
      await this.createOne(to);

      return result;
    } 
    catch (error) {
      throw new BadRequestException('Unknown currency');
    }
  }

  private async createOne(name: string): Promise<void> {
    const currency =  await this.currenciesRepository.findOne({ where: { name } });
    
    if (!currency) {
      await this.currenciesRepository.save({ name});
    }
  }

  private async convertCurrency(
    from: string,
    to: string,
    amount: number,
  ): Promise<number> {
    const response = await axios.get(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`,);
    const result = response.data.rates[to];
    
    return result.toFixed(2);
  }
}
