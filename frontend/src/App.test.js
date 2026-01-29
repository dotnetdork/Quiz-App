/**
 * App Component Tests
 * 
 * Basic tests for the Quiz App
 */
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Quiz App brand', () => {
  render(<App />);
  const brandElement = screen.getByText(/Quiz App/i);
  expect(brandElement).toBeInTheDocument();
});
