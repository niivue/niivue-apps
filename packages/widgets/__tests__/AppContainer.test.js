import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { AppContainer } from '../lib/widgets.jsx';

describe('AppContainer', () => {
  test('renders the AppContainer component', () => {
    render(<AppContainer />);
    const appContainerElement = screen.getByText(/AppContainer/i);
    expect(appContainerElement).toBeInTheDocument();
  });
});
