import { server } from '../../mocks/server';
import { rest } from 'msw';
import { fetchPaymentDetailFromAPI } from '../paymentDetailFetch';

describe('fetch', () => {
  it('should return correct data when fetch API successfully', async () => {
    const result = await fetchPaymentDetailFromAPI();
    expect(result.data).toHaveProperty('originPaymentAmount', 10000);
    expect(result.data).toHaveProperty('paymentFrequency', '每年');
    expect(result.data).toHaveProperty('paymentAmount', 8000);
    expect(result.data).toHaveProperty('discount', '八折');
  });

  it('should handler error message when fetch API failed', async () => {
    server.use(
      rest.get(/\/orders\/[0-9]+\/payments\/[0-9]+/, (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );
    await expect(fetchPaymentDetailFromAPI()).rejects.toHaveProperty(
      'message',
      'HTTP error! status: 500'
    );
  });

  it('should handle network error when fetch API occurred a network error', async () => {
    server.use(
      rest.get(/\/orders\/[0-9]+\/payments\/[0-9]+/, (req, res, ctx) => {
        return res.networkError('');
      })
    );

    await expect(fetchPaymentDetailFromAPI()).rejects.toHaveProperty(
      'message',
      'NetworkError'
    );
  });
});
