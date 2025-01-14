import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App component', () => {
  test('renders main components', () => {
    render(<App />);
    
    const headerElement = screen.getByText(/Buffet Ordering System/i);
    expect(headerElement).toBeInTheDocument();
    
    const customerElement = screen.getByText(/Customer Ordering/i);
    expect(customerElement).toBeInTheDocument();
  });
});
