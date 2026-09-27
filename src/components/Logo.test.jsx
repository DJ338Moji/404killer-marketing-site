import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Logo from './Logo';

describe('Logo Component', () => {
  it('renders 404 KILLER APP text when showText is true', () => {
    render(<Logo showText={true} />);
    expect(screen.getByText(/KILLER/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenue Shield/i)).toBeInTheDocument();
  });

  it('renders the logo image', () => {
    render(<Logo />);
    const logoImg = screen.getByAltText(/404 Killer App/i);
    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute('src', '/app-icon.png');
  });
});
