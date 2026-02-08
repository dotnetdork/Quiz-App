/**
 * App Component Tests
 * 
 * Basic tests for the Quiz App
 */
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders League Quiz brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/League Quiz/i);
  expect(brandElement).toBeInTheDocument();
});
