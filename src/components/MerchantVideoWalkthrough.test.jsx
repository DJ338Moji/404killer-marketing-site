import React from 'react';
import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import MerchantVideoWalkthrough from './MerchantVideoWalkthrough';

describe('MerchantVideoWalkthrough', () => {
  it('renders without crashing', () => {
    render(<MerchantVideoWalkthrough onClose={() => {}} />);
  });
});
