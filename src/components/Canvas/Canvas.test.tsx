import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {  render  } from '@testing-library/react';
import Canvas from './index';

test('renders content', () => {
	const component = render(
		<Canvas/>
	);
	expect(component.container).toBeDefined();
	expect(component.container.getElementsByTagName("canvas")).toBeDefined();
});

