import { connect } from 'react-redux';
import React, { useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Card,
  Skeleton,
  Grid,
  CardMedia,
  Button,
  Alert,
  AlertTitle,
  Box,
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import styles from '../../styles/courseAdjustment.module.css';
import {
  fetchCourseAdjustment,
  selectAdjustmentDetails,
  selectError,
  selectLoadingStatus,
} from '../../reducers/courseAdjustmentReducer';
import noData from '../../images/noData.png';
import { isNull } from 'lodash';

export const CourseAdjustment = (props) => {
  const { isLoading, error, adjustmentDetails, fetchCourseAdjustment } = props;
  const isNetworkError = error?.message === 'NetworkError';

  useEffect(() => {
    fetchCourseAdjustment();
  }, [fetchCourseAdjustment]);

  const handleRetry = () => {
    fetchCourseAdjustment();
  };
  console.log(adjustmentDetails);
  if (isNull(adjustmentDetails)) {
    if (isNetworkError) {
      return (
        <div data-testid="networkError" className={styles.alert}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            您的网络异常，请检查网络后
            <Button
              onClick={handleRetry}
              variant="text"
              endIcon={<ReplayIcon />}
            >
              重试
            </Button>
          </Alert>
        </div>
      );
    }
    if (error) {
      return (
        <div className={styles.alert}>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            请求失败，请
            <Button
              onClick={handleRetry}
              variant="text"
              endIcon={<ReplayIcon />}
            >
              重试
            </Button>
          </Alert>
        </div>
      );
    }
  }

  const Content = () => {
    return adjustmentDetails?.adjustmentList.length === 0 ? (
      <Grid container>
        <p data-testid="noData" className={styles.noDataDescription}>
          该课程改进暂未完成，请稍后查看
        </p>
        <CardMedia
          component="img"
          height="600"
          image={noData}
          alt="Paella dish"
        ></CardMedia>
      </Grid>
    ) : (
      <div className={styles.details}>
        <h2>课程名称：{adjustmentDetails?.courseName}</h2>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            {adjustmentDetails?.adjustmentList.map((item) => {
              return (
                <p key={uuid()} className={styles.item}>
                  {item.originContent}
                </p>
              );
            })}
          </Grid>
          <Grid item xs={6}>
            {adjustmentDetails?.adjustmentList.map((item) => {
              return (
                <p key={uuid()} className={styles.adjustedItem}>
                  {item.adjustedContent}
                </p>
              );
            })}
          </Grid>
        </Grid>
      </div>
    );
  };

  return (
    <div className={styles.courseAdjustment}>
      <Card>
        {isLoading ? (
          <Box data-testid="isLoading" sx={{ width: '100%' }}>
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
          </Box>
        ) : (
          <Content />
        )}
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isLoading: selectLoadingStatus(state),
    adjustmentDetails: selectAdjustmentDetails(state),
    error: selectError(state),
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchCourseAdjustment: () => dispatch(fetchCourseAdjustment()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CourseAdjustment);
