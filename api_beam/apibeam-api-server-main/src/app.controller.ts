import {
  Body,
  Controller,
  Delete,
  GatewayTimeoutException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SocketGateway } from './socket/socket.gateway';
import { Request, Response } from 'express';

const getTrimRoute = (route: string) => {
  const regex = /\/app\/([^\/]+)\/([^\/]+)/g;

  // Replace with the desired structure, e.g., '/newpath/:id/*' while keeping :id and * intact
  const newString = route.replace(regex, (match, id, response) => {
    return response; // Replace with new path structure
  });
  return newString;
};

@Controller('app')
export class AppController {
  constructor(private readonly gateway: SocketGateway) {}

  private buildTimeoutHtml(message: string) {
    const setupUrl = 'https://github.com/niteshSingh17/apibeam/#apibeam';
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Gateway Timeout</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f4f6fb; color: #111827; font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    .card { max-width: 680px; width: 100%; margin: 20px; padding: 32px; background: #fff; border-radius: 24px; box-shadow: 0 25px 50px rgba(15,23,42,0.08); border: 1px solid #e5e7eb; }
    .badge { display: inline-flex; align-items: center; gap: 0.5rem; background: #eef2ff; color: #1d4ed8; border-radius: 999px; padding: 0.5rem 0.9rem; font-weight: 700; font-size: 0.9rem; }
    .title { margin: 20px 0 8px; font-size: 2.6rem; line-height: 1.05; letter-spacing: -0.04em; }
    .subtitle { margin: 0 0 20px; color: #4b5563; font-size: 1rem; }
    .message { margin: 0; font-size: 1.05rem; line-height: 1.8; color: #1f2937; }
    .link { display: inline-flex; margin-top: 24px; color: #1d4ed8; text-decoration: none; font-weight: 600; }
    .link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Gateway timeout</span>
    <h1 class="title">Request timed out</h1>
    <p class="subtitle">The requested action did not complete in time.</p>
    <p class="message">${this.escapeHtml(message)}</p>
    <a class="link" href="${setupUrl}" target="_blank" rel="noreferrer">View setup instructions</a>
  </div>
</body>
</html>`;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private async handleHttpRequest(roomId: string, payload: any, res: Response) {
    try {
      const response = await this.gateway.sendToRoomAndWait(roomId, payload);
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof GatewayTimeoutException) {
        const html = this.buildTimeoutHtml(error.message);
        res.status(504).type('text/html').send(html);
        return;
      }
      throw error;
    }
  }

  @Get(':roomId/test-me')
  async test(
    @Param('roomId') roomId: string,
    @Query('message') message: string,
    @Res() res: Response,
  ) {
    return this.handleHttpRequest(
      roomId,
      {
        model: 'gpt-4o',
        instructions:
          'You are a personal assistant who is here to help me with my problems',
        body: message,
        route: 'responses',
      },
      res,
    );
  }

  @Get(':roomId/*')
  async getSendMessage(
    @Param('roomId') roomId: string,
    @Query() body: any,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const route = getTrimRoute(request.path);
    return this.handleHttpRequest(
      roomId,
      {
        ...body,
        route: route,
      },
      res,
    );
  }

  @Post(':roomId/*')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Body() body: any,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const route = getTrimRoute(request.path);
    return this.handleHttpRequest(
      roomId,
      {
        body: body,
        route: route,
      },
      res,
    );
  }

  @Patch(':roomId/*')
  async patchSendMessage(
    @Param('roomId') roomId: string,
    @Body() body: any,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const route = getTrimRoute(request.path);
    return this.handleHttpRequest(
      roomId,
      {
        ...body,
        route: route,
      },
      res,
    );
  }

  @Put(':roomId/*')
  async putSendMessage(
    @Param('roomId') roomId: string,
    @Body() body: any,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const route = getTrimRoute(request.path);
    return this.handleHttpRequest(
      roomId,
      {
        ...body,
        route: route,
      },
      res,
    );
  }

  @Delete(':roomId/*')
  async deleteSendMessage(
    @Param('roomId') roomId: string,
    @Body() body: any,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const route = getTrimRoute(request.path);
    return this.handleHttpRequest(
      roomId,
      {
        ...body,
        route: route,
      },
      res,
    );
  }
}
