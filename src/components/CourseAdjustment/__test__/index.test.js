import { fireEvent, render, screen } from '@testing-library/react';
import { CourseAdjustment } from '../index';
import adjustmentDetails from '../../../mocks/data/courseAdjustment.json';
import '@testing-library/jest-dom/extend-expect';

describe('CourseAdjustment', () => {
  let props;
  let fetchDataSpy = jest.fn();
  beforeEach(() => {
    props = {
      isLoading: true,
      adjustmentDetails: null,
      error: null,
      fetchCourseAdjustment: fetchDataSpy,
    };
  });

  it('should render loading component when isLoading is pending', () => {
    render(<CourseAdjustment {...props} />);

    expect(screen.getByTestId('isLoading')).toBeInTheDocument();
  });

  it('should render correct page when have data', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails,
    };

    render(<CourseAdjustment {...newProps} />);

    expect(screen.queryByTestId('isLoading')).not.toBeInTheDocument();
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
  });

  it('should render empty page when adjustmentList is empty', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails: {
        ...adjustmentDetails,
        adjustmentList: [],
      },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByTestId('noData')).toBeInTheDocument();
  });

  it('should show correct page when has error but there is data in cache', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails,
      error: { name: 'error', message: 'HTTP error! status: 500' },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.queryByTestId('isLoading')).not.toBeInTheDocument();
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
  });

  it('should show correct page when has error but there is empty data in cache', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails: {
        ...adjustmentDetails,
        adjustmentList: [],
      },
      error: { name: 'error', message: 'HTTP error! status: 500' },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByTestId('noData')).toBeInTheDocument();
  });

  it('should alert when there occurred an error and no data in cache', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails: null,
      error: { name: 'error', message: 'HTTP error! status: 500' },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should invoke fetch data when click retry button', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails: null,
      error: { name: 'error', message: 'HTTP error! status: 500' },
    };
    render(<CourseAdjustment {...newProps} />);

    const retryBtn = screen.getByText('重试');
    fireEvent.click(retryBtn);
    expect(fetchDataSpy).toHaveBeenCalled();
  });

  it('should show correct page when has netWork error but there is data in cache', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails,
      error: { name: 'Typeerror', message: 'NetworkError' },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.queryByTestId('isLoading')).not.toBeInTheDocument();
    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
  });

  it('should show correct page when has netWork error but there is empty data in cache', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails: {
        ...adjustmentDetails,
        adjustmentList: [],
      },
      error: { name: 'Typeerror', message: 'NetworkError' },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByTestId('noData')).toBeInTheDocument();
  });

  it('should alert when there occurred a network error and no data in cache', () => {
    const newProps = {
      ...props,
      isLoading: false,
      adjustmentDetails: null,
      error: { name: 'Typeerror', message: 'NetworkError' },
    };
    render(<CourseAdjustment {...newProps} />);

    expect(screen.getByTestId('networkError')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
