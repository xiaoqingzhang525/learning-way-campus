// src/mocks/handlers.js
import { rest } from 'msw';
import courseAdjustment from './data/courseAdjustment.json';
import paymentDetail from './data/paymentDetail.json';

export const handlers = [
  rest.get(/\/orders\/[0-9]+\/payments\/[0-9]+/, async (req, res, ctx) => {
    return await res(ctx.status(500));
  }),

  rest.get(/\/orders\/[0-9]+\/payments\/[0-9]+/, async (req, res, ctx) => {
    return await res.networkError('error');
  }),

  rest.get(/\/orders\/[0-9]+\/payments\/[0-9]+/, async (req, res, ctx) => {
    return await res(ctx.status(200), ctx.json({ data: paymentDetail }));
  }),

  // rest.get(
  //   /\/orders\/[0-9]+\/course-adjustments\/[0-9]+/,
  //   async (req, res, ctx) => {
  //     return await res(ctx.status(500));
  //   }
  // ),

  // rest.get(
  //   /\/orders\/[0-9]+\/course-adjustments\/[0-9]+/,
  //   async (req, res, ctx) => {
  //     return await res.networkError('error');
  //   }
  // ),

  rest.get(
    /\/orders\/[0-9]+\/course-adjustments\/[0-9]+/,
    async (req, res, ctx) => {
      return await res(ctx.status(200), ctx.json({ data: courseAdjustment }));
    }
  ),
];
