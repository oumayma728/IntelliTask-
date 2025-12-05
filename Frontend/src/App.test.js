// App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios
jest.mock('./api/api.js', () => ({
  api: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  }
}));

test('renders App component', () => {
  render(<App />);
  expect(screen).toBeTruthy(); // basic smoke test
});
