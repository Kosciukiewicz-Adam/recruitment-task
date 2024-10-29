import { Controller, Post, Body } from '@nestjs/common';
import { AppService, ExchangeData } from './app.service';
import { CashedItemsKeys } from './const/chasedItemsKeys';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
    this.appService.casheCurrencyeRate();
  }

  @Post()
  async getExchangeValue(@Body() postData: { value: number },) {
    const currencyRate: number = await this.appService.getCasheValue(CashedItemsKeys.CURRENCY_RATE) as number;
    const exchangeValue = Math.round((postData.value * (currencyRate as number) + Number.EPSILON) * 100) / 100;

    const exchangeData: ExchangeData = {
      pln: exchangeValue,
      euro: postData.value,
      currencyRate,
      timeStamp: new Date(),
    };

    this.appService.saveExchangeData(exchangeData);

    return { exchangeValue: exchangeData.pln };
  }
}
