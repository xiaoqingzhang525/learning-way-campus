export const fetchCourseAdjustmentFromAPI = async () => {
  try {
    const response = await fetch('/orders/1/course-adjustments/123', {
      method: 'GET',
    });
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('NetworkError');
    } else {
      throw error;
    }
  }
};
