import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import App from '../App';
import UnlockGate from '../components/UnlockGate';

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { functions: { invoke } } }));

beforeEach(() => { localStorage.clear(); invoke.mockReset(); });
afterEach(cleanup);

describe('public information and paid routes', () => {
  it.each(['/legal', '/privacy', '/terms'])('opens %s without a purchase', path => {
    window.history.replaceState({}, '', path);
    render(<HelmetProvider><App /></HelmetProvider>);
    expect(screen.getByRole('heading', { name: 'Terms of Use, Privacy & Policies' })).toBeInTheDocument();
    expect(invoke).not.toHaveBeenCalled();
  });
  it('opens recovery help without a purchase', () => {
    window.history.replaceState({}, '', '/access-help');
    render(<HelmetProvider><App /></HelmetProvider>);
    expect(screen.getByRole('heading', { name: 'Ready to play again?' })).toBeInTheDocument();
    expect(invoke).not.toHaveBeenCalled();
  });
  it.each(['/', '/play', '/decks'])('keeps %s gated', async path => {
    window.history.replaceState({}, '', path);
    render(<HelmetProvider><App /></HelmetProvider>);
    expect(await screen.findByRole('textbox', { name: 'Gumroad license key' })).toBeInTheDocument();
  });
});

describe('saved key recovery', () => {
  it('preserves a key during an outage and unlocks only after a successful retry', async () => {
    localStorage.setItem('sitch_license_key', 'test-key');
    invoke.mockResolvedValueOnce({ data: null, error: new Error('Unavailable') });
    render(<UnlockGate><p>Protected game</p></UnlockGate>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Check your connection');
    expect(localStorage.getItem('sitch_license_key')).toBe('test-key');
    expect(screen.queryByText('Protected game')).not.toBeInTheDocument();
    invoke.mockResolvedValueOnce({ data: { valid: true }, error: null });
    fireEvent.click(screen.getByRole('button', { name: 'Unlock' }));
    expect(await screen.findByText('Protected game')).toBeInTheDocument();
  });
  it('removes an explicitly rejected key and keeps the game locked', async () => {
    localStorage.setItem('sitch_license_key', 'revoked-key');
    invoke.mockResolvedValue({ data: { valid: false }, error: null });
    render(<UnlockGate><p>Protected game</p></UnlockGate>);
    await waitFor(() => expect(localStorage.getItem('sitch_license_key')).toBeNull());
    expect(screen.queryByText('Protected game')).not.toBeInTheDocument();
  });
});
