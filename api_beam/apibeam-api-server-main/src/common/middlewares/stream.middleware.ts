import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class StreamMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isStream =
      req.body?.stream === true ||
      req.body?.stream === 'true' ||
      req.query?.stream === 'true' ||
      (req.headers?.accept || '').includes('text/event-stream');
    if (isStream) {
      res.json = function (body: any) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');

        // if route is /v1/responses use responses api event stream
        if (req.originalUrl.includes('/v1/responses')) {
          const responseId = body.id || `resp_${Date.now()}`;
          const createdAt = body.created_at || Math.floor(Date.now() / 1000);
          const model = body.model || 'gpt-5.4';

          const outputItem = body.output?.[0] || {
            id: `msg_${Date.now()}`,
            type: 'message',
            role: 'assistant',
            status: 'completed',
            content: [{ type: 'output_text', text: '' }],
          };

          const itemId = outputItem.id;
          const fullText = outputItem.content?.[0]?.text || '';

          // EVENT 1 response.created
          res.write(
            `data: ${JSON.stringify({
              type: 'response.created',
              response: {
                id: responseId,
                object: 'response',
                created_at: createdAt,
                model,
                status: 'in_progress',
              },
            })}\n\n`,
          );

          // EVENT 2 output item added
          res.write(
            `data: ${JSON.stringify({
              type: 'response.output_item.added',
              output_index: 0,
              item: {
                id: itemId,
                type: 'message',
                status: 'in_progress',
                role: 'assistant',
                content: [],
              },
            })}\n\n`,
          );

          // EVENT 3 token deltas
          for (const ch of fullText) {
            res.write(
              `data: ${JSON.stringify({
                type: 'response.output_text.delta',
                item_id: itemId,
                delta: ch,
              })}\n\n`,
            );
          }

          // EVENT 4 output item done
          res.write(
            `data: ${JSON.stringify({
              type: 'response.output_item.done',
              output_index: 0,
              item: outputItem,
            })}\n\n`,
          );

          // EVENT 5 completed
          res.write(
            `data: ${JSON.stringify({
              type: 'response.completed',
              response: body,
            })}\n\n`,
          );

          res.write(`data: [DONE]\n\n`);
          res.end();
          return this;
        }

        res.write(`data: ${JSON.stringify(body)}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
        return this;
      };
    }

    next();
  }
}
