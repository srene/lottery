import { Controller, Get, Param, Post, Body, Query, ForbiddenException } from '@nestjs/common';
import { AppService } from './app.service';
import { DelegateTokenDto, RequestTokenDto, TransferTokenDto, CastVoteDto } from './dtos/requestToken.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // Get current contract informations

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock();
  }

  @Get('tokenContract-address')
  getTokenContractAddress() {
    return this.appService.getTokenContractAddress();
  }

  @Get('tokenizedBet-address')
  getTokenizedBetsAddress() {
    return this.appService.getTokenizedBetsAddress();
  }

  // Get address and transactions informations

  @Get("receipt")
  getReceipt(@Query('hash') hash: string) {
    return this.appService.getReceipt(hash);
  }

  a: number = 0;

  @Post('request-tokens')
  requestTokens(@Body() body: RequestTokenDto) {
    return this.appService.requestTokens(body.address, body.mintValue, body.signature);
  }

}
