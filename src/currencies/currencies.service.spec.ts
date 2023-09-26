import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from './currencies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { Currency } from './entities/currency.entity';

describe('CurrenciesService', () => {
  let currenciesService: CurrenciesService;
  let currencyRepository: Repository<Currency>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: getRepositoryToken(Currency),
          useClass: Repository,
        },
      ],
    }).compile();

    currenciesService = module.get<CurrenciesService>(CurrenciesService);
    currencyRepository = module.get<Repository<Currency>>(
      getRepositoryToken(Currency),
    );
  });

  describe('findAll', () => {
    it('should return an array of currencies', async () => {
      const currencies = [{ name: 'USD' }, { name: 'EUR' }] as Currency[];
      jest.spyOn(currencyRepository, 'createQueryBuilder').mockReturnValue({
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(currencies),
      } as any);

      const result = await currenciesService.findAll('USD');

      expect(result).toEqual(currencies);
    });
  });

  describe('findOne', () => {
    it('should convert currency and return result', async () => {
      const from = 'USD';
      const to = 'EUR';
      const amount = 100;
      const expectedConversionResult = 85.0;
  
      jest.spyOn(currencyRepository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(currencyRepository, 'findOne').mockResolvedValueOnce(null);
  
      const savedCurrency = new Currency();
      jest.spyOn(currencyRepository, 'save').mockResolvedValueOnce(savedCurrency);
      jest.spyOn(currencyRepository, 'save').mockResolvedValueOnce(savedCurrency);
  
      const axiosMock = jest
        .spyOn(currenciesService as any, 'convertCurrency')
        .mockResolvedValue(expectedConversionResult);
  
      const result = await currenciesService.getRateExchange(from, to, amount);
  
      expect(result).toEqual(expectedConversionResult);
      expect(axiosMock).toHaveBeenCalledWith(from, to, amount);
      expect(currencyRepository.save).toHaveBeenCalledTimes(2);
    });
  

    it('should handle unknown currency', async () => {
      const from = 'USD';
      const to = 'UNKNOWN';

      jest.spyOn(currencyRepository, 'findOne').mockResolvedValueOnce(null);

      try {
        await currenciesService.getRateExchange(from, to);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Unknown currency');
      }
    });

    it('should throw BadRequestException if amount is not a number', async () => {
      const from = 'USD';
      const to = 'EUR';
      const invalidAmount = 'invalid';
    
      await expect(currenciesService.getRateExchange(from, to, parseInt(invalidAmount))).rejects.toThrowError(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if origin and destination currency are the same', async () => {
      const sameCurrency = 'USD';
  
      await expect(currenciesService.getRateExchange(sameCurrency, sameCurrency)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });
});
