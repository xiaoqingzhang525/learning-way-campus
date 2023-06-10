import { server } from '../../mocks/server';
import { rest } from 'msw';
import { fetchCourseAdjustmentFromAPI } from '../courseAdjustmentFetch';
import courseAdjustment from '../../mocks/data/courseAdjustment.json';

// stub BFF, so that service invoke bff api and get data correctly
describe('course adjustment detail fetch', () => {
  it('should return correct data when fetch API successfully', async () => {
    const result = await fetchCourseAdjustmentFromAPI();
    expect(result.data).toHaveProperty('courseId', '123');
    expect(result.data).toHaveProperty('courseName', '数学');
    expect(result.data.adjustmentList.length).toBe(2);
  });

  it('should return correct data when fetch API successfully and there is no data', async () => {
    server.use(
      rest.get(
        /\/orders\/[0-9]+\/course-adjustments\/[0-9]+/,
        async (req, res, ctx) => {
          return await res(
            ctx.status(200),
            ctx.json({
              data: {
                ...courseAdjustment,
                adjustmentList: [],
              },
            })
          );
        }
      )
    );
    const result = await fetchCourseAdjustmentFromAPI();
    expect(result.data).toHaveProperty('courseId', '123');
    expect(result.data).toHaveProperty('courseName', '数学');
    expect(result.data.adjustmentList.length).toBe(0);
  });

  it('should return error message when fetch API failed', async () => {
    server.use(
      rest.get(
        /\/orders\/[0-9]+\/course-adjustments\/[0-9]+/,
        (req, res, ctx) => {
          return res(ctx.status(500));
        }
      )
    );
    await expect(
      fetchCourseAdjustmentFromAPI('/orders/1/publishListing')
    ).rejects.toHaveProperty('message', 'HTTP error! status: 500');
  });

  it('should return network error message when request over time', async () => {
    server.use(
      rest.get(
        /\/orders\/[0-9]+\/course-adjustments\/[0-9]+/,
        (req, res, ctx) => {
          return res.networkError('');
        }
      )
    );

    await expect(fetchCourseAdjustmentFromAPI()).rejects.toHaveProperty(
      'message',
      'NetworkError'
    );
  });
});
