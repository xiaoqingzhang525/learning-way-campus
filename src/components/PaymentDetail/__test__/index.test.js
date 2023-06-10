import { fireEvent, render, screen } from '@testing-library/react';
import { PaymentDetail } from '../index';
import '@testing-library/jest-dom/extend-expect';
import paymentDetail from '../../../mocks/data/paymentDetail.json';

describe('PaymentDetail', () => {
  let props;
  let fetchDataSpy = jest.fn();
  let decrementSpy = jest.fn();
  let wrapper;
  beforeEach(() => {
    props = {
      isLoading: true,
      error: null,
      fetchPaymentDetail: fetchDataSpy,
      decrementRetryCount: decrementSpy,
      paymentDetail: null,
    };

    // eslint-disable-next-line testing-library/no-render-in-setup
    wrapper = render(<PaymentDetail {...props} />);
  });
  it('should loading page when isLoading is true', () => {
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should invoke fetchDataSpy when render page', () => {
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
  });

  it('should render correct page when paymentDetail has data', () => {
    const newProps = {
      ...props,
      isLoading: false,
      paymentDetail,
      error: null,
    };

    render(<PaymentDetail {...newProps} />);
    expect(screen.getByText('支付详情')).toBeInTheDocument();
    expect(screen.getByText('支付金额：8000USD')).toBeInTheDocument();
    expect(screen.getByText('支付方式：每年')).toBeInTheDocument();
    expect(screen.getByText('支付')).toBeInTheDocument();
    expect(screen.getByText('支付').disabled).toBe(false);
  });

  it('should alert user there are error happened when error is not null', () => {
    const newProps = {
      ...props,
      isLoading: false,
      error: {
        name: 'Error',
        message: 'HTTP error! status: 500',
      },
      retryCount: 3,
    };

    render(<PaymentDetail {...newProps} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('支付').disabled).toBe(true);
    expect(screen.getByText('重试').disabled).toBe(false);
  });

  it('should disable payment button when retry is 0', () => {
    const newProps = {
      ...props,
      isLoading: false,
      error: {
        name: 'Error',
        message: 'HTTP error! status: 500',
      },
      retryCount: 0,
    };

    render(<PaymentDetail {...newProps} />);
    expect(screen.getByText('支付').disabled).toBe(true);
  });

  it('should invoke decrement and fetch data when click retry button', () => {
    const newProps = {
      ...props,
      isLoading: false,
      error: {
        name: 'Error',
        message: 'HTTP error! status: 500',
      },
      retryCount: 2,
    };
    render(<PaymentDetail {...newProps} />);

    const retryBtn = screen.getByText('重试');
    fireEvent.click(retryBtn);
    expect(decrementSpy).toHaveBeenCalled();
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should alert use to connect with workers if retry error', () => {
    const newProps = {
      ...props,
      isLoading: false,
      error: {
        name: 'Error',
        message: 'HTTP error! status: 500',
      },
      retryCount: 0,
    };
    render(<PaymentDetail {...newProps} />);

    expect(
      screen.getByText(
        '服务端出现异常，请稍后重试或联系我们的客户支持团队以获取更多帮助，联系电话：12390'
      )
    ).toBeInTheDocument();
  });

  it('should disable payment when error is network error', () => {
    const newProps = {
      ...props,
      error: { name: 'Typeerror', message: 'NetworkError' },
      isLoading: false,
      retryCount: 3,
    };
    render(<PaymentDetail {...newProps} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('重试').disabled).toBe(false);
  });

  it('should disable payment and retry button when retry is 0 and error is network error', () => {
    const newProps = {
      ...props,
      isLoading: false,
      error: { name: 'Typeerror', message: 'NetworkError' },
      retryCount: 0,
    };

    render(<PaymentDetail {...newProps} />);
    expect(screen.getByText('支付').disabled).toBe(true);
    expect(
      screen.getByText(
        '出现了网络故障，我们暂时无法处理您的请求，请检查网络后重试，如问题持续存在，请联系我们的客户支持团队以获取更多帮助，联系电话：12390'
      )
    ).toBeInTheDocument();
  });
});
