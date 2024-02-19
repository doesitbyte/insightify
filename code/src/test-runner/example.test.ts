import { run } from '../functions/product_review';

describe('Test some function', () => {
  it('Something', () => {
    run([
      {
        payload: {
          work_created: {
            work: {
              id: 'some-id',
            },
          },
        },
      },
    ]);
  });
});
