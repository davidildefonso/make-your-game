import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
	render(<App/>);

	const element = screen.getByText(/hello webpack/);
	expect(element).toBeDefined();

	const zero = screen.getByText(/0/);
	expect(zero).toBeDefined();

});

test('add to the counter on "press" button click', () => {
	render(<App/>);

	const button = screen.getByText(/press/);
	fireEvent.click(button);

	const zero = screen.queryByText(/0/);
	expect(zero).toBeNull();

	const clicks = screen.queryByText(/1/);
	expect(clicks).toBeDefined();

});