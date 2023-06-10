import React, { useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import styles from '../../styles/paymentDetail.module.css';
import { connect } from 'react-redux';
import {
  fetchPaymentDetail,
  selectError,
  selectIsLoading,
  selectPaymentDetail,
  decrementRetryCount,
  selectRetryCount,
} from '../../reducers/paymentDetailReducer';
import { isNull } from 'lodash';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Alert,
  AlertTitle,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

export const PaymentDetail = (props) => {
  const {
    isLoading,
    fetchPaymentDetail,
    paymentDetail,
    retryCount,
    error,
    decrementRetryCount,
  } = props;
  const isNetworkError = error?.message === 'NetworkError';

  useEffect(() => {
    fetchPaymentDetail();
  }, [fetchPaymentDetail]);

  const handleRetry = () => {
    decrementRetryCount();
    fetchPaymentDetail();
  };

  const Alerting = () => {
    return retryCount > 0 ? (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {isNetworkError ? '网络异常，请' : '糟糕，请求失败，请'}
        <Button
          disabled={retryCount === 0}
          onClick={handleRetry}
          variant="text"
          endIcon={<ReplayIcon />}
        >
          重试
        </Button>
      </Alert>
    ) : (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {isNetworkError
          ? '出现了网络故障，我们暂时无法处理您的请求，请检查网络后重试，如问题持续存在，请联系我们的客户支持团队以获取更多帮助，联系电话：12390'
          : '服务端出现异常，请稍后重试或联系我们的客户支持团队以获取更多帮助，联系电话：12390'}
      </Alert>
    );
  };

  console.log(error === null && paymentDetail);

  const PaymentContent = () => {
    return (
      <>
        {!error && paymentDetail ? (
          <Card>
            <CardContent>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                支付详情
              </Typography>
              <Typography variant="h5" component="div">
                支付金额：{paymentDetail.paymentAmount}
                {paymentDetail?.currency}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                支付方式：{paymentDetail.paymentFrequency}
              </Typography>
              <Typography variant="body2">
                原价：{paymentDetail.originPaymentAmount}
                <br />
                折扣：{paymentDetail.discount}
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Alerting />
        )}
        <CardActions className={styles.cardAction}>
          <Button
            disabled={!(isNull(error) && paymentDetail)}
            size="small"
            variant="contained"
          >
            支付
          </Button>
        </CardActions>
      </>
    );
  };

  return (
    <div className={styles.paymentDetail}>
      {isLoading ? <CircularProgress /> : <PaymentContent />}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    error: selectError(state),
    isLoading: selectIsLoading(state),
    paymentDetail: selectPaymentDetail(state),
    retryCount: selectRetryCount(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchPaymentDetail: () => dispatch(fetchPaymentDetail()),
  decrementRetryCount: () => dispatch(decrementRetryCount()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentDetail);
