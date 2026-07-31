import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MyPageView } from './MyPageView';
import '@testing-library/jest-dom';

vi.mock('../lib/supabaseClient', () => ({
  supabase: {
    auth: {
      updateUser: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signOut: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn(),
  },
}));

describe('MyPageView Accessibility', () => {
  it('file input has sr-only class instead of hidden', () => {
    render(<MyPageView isPremium={false} setIsPremium={() => {}} theme="default" setTheme={() => {}} session={null} />);
    const fileInput = screen.getByLabelText('アイコン画像を変更');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveClass('sr-only');
    expect(fileInput).not.toHaveClass('hidden');
  });

  it('file input is focusable', () => {
    render(<MyPageView isPremium={false} setIsPremium={() => {}} theme="default" setTheme={() => {}} session={null} />);
    const fileInput = screen.getByLabelText('アイコン画像を変更');
    fileInput.focus();
    expect(fileInput).toHaveFocus();
  });
});
