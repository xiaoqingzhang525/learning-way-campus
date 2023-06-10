import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import CourseAdjustment from './components/CourseAdjustment/index';
import PaymentDetail from './components/PaymentDetail';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/courseAdjustment" element={<CourseAdjustment />} />
        <Route path="/paymentDetail" element={<PaymentDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
