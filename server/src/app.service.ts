import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject } from '@nestjs/common';
import { CashedItemsKeys } from './const/chasedItemsKeys';
import { Interval } from '@nestjs/schedule';
import { writeFile, existsSync, readFile } from 'fs';


export interface ExchangeData {
  currencyRate: number,
  timeStamp: Date,
  euro: number,
  pln: number,
}

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
  }

  async fetchExchangeRate(): Promise<number> {
    const response = await fetch(process.env.API_URL, {
      headers: {
        "x-api-key": process.env.API_KEY
      }
    });

    if (response.status !== 200) {
      throw new Error('Failed fetching exchangeRate');
    }

    const data = await response.json();
    return data.exchange_rate;
  }

  async setCasheValue(key: CashedItemsKeys, value: number) {
    await this.cacheManager.set(key, value, 60000);
  }

  async getCasheValue(key: CashedItemsKeys): Promise<unknown> {
    const cashedItem = await this.cacheManager.get(key);
    return cashedItem;
  }

  saveExchangeData(exchangeData: ExchangeData) {
    if (existsSync('exchanges.json')) {
      readFile('exchanges.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
          console.log(err);
        } else {
          const fileData = JSON.parse(data);
          fileData.push(exchangeData);
          writeFile('exchanges.json', JSON.stringify(fileData), 'utf8', () => { });
        }
      });
    } else {
      writeFile('exchanges.json', JSON.stringify([exchangeData]), 'utf8', () => { })
    }
  }

  @Interval(6000)
  async casheCurrencyeRate() {
    const currencyRate = await this.fetchExchangeRate();

    if (currencyRate) {
      await this.setCasheValue(CashedItemsKeys.CURRENCY_RATE, currencyRate);
    }
  }
}
