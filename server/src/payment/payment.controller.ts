import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paytrService: PaymentService) {}

  @Get('success')
  async handleSuccess(
    @Query('merchant_oid') merchantOid: string,
    @Req() req: any,
    @Res() res: any,
  ) {
    const callback = req.body;
    console.log('Ödeme Başarılı:', callback);
    await this.paytrService.handleSuccess(merchantOid);
    return res.redirect(`${process.env.CLIENT}/odeme/basarili/${merchantOid}`);
  }

  @Get('fail')
  async handleFail(@Query() query: any, @Req() req: any, @Res() res: any) {
    const { merchant_oid } = query;

    console.log('Ödeme Başarısız:', merchant_oid);

    // Kullanıcıya gösterilecek başarısızlık mesajı
    return res.redirect(`${process.env.CLIENT}/odeme/basarisiz`);
  }
}
