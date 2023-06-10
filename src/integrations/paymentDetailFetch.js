export const fetchPaymentDetailFromAPI = async () => {
  try {
    const response = await fetch('/orders/1/payments/9', {
      method: 'GET',
    });

    if (response.ok) {
      return response.json();
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
