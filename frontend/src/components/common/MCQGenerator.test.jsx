import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest'; // 👈 1. Added 'vi' to the import
import MCQGenerator from '../MCQGenerator';

// 2. Changed 'jest.mock' to 'vi.mock'
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: '[{"question": "What is Vitest?"}]' } }],
          }),
        },
      },
    })),
  };
});

describe('MCQGenerator Component', () => {
  it('should display the generator title', () => {
    render(<MCQGenerator />);
    const heading = screen.getByRole('heading', { name: /Generate Questions/i });
    expect(heading).toBeTruthy();
  });
});