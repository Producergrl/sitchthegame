import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Holiday, { HOLIDAY_CHECKOUT_URL } from '../pages/Holiday';

const renderHoliday = () =>
  render(
    <HelmetProvider>
      <Holiday />
    </HelmetProvider>,
  );

describe('holiday landing page', () => {
  it('uses the approved draft copy and placeholder table-card questions', () => {
    renderHoliday();

    expect(screen.getByRole('heading', { name: "This year's holiday table talk, without the lecture." })).toBeInTheDocument();
    expect(screen.getByText(/practice the conversations that help kids make safer choices — as a game, not a speech/)).toBeInTheDocument();
    expect(screen.getByText(/Start with five conversation starters you can use tonight/)).toBeInTheDocument();
    expect(screen.getByText(/Sitch — Family Edition is a family game of real-life situations/)).toBeInTheDocument();
    expect(screen.getByText(/\$6\.99, one time\. It arrives in your inbox, no shipping/)).toBeInTheDocument();
    expect(screen.getByText('Sitch is a game, not a replacement for therapy or a medically endorsed product.')).toBeInTheDocument();
    expect(screen.getByText(/20% of net proceeds are donated to completing/)).toBeInTheDocument();
    expect(screen.getByText('Open Secret')).toBeInTheDocument();

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText(/A classmate shows you a group chat making fun of another kid/)).toBeInTheDocument();
    expect(screen.getByText(/Someone you met in a game says they're your age/)).toBeInTheDocument();
    expect(screen.getByText(/A grown-up you don't know says Mom sent them to pick you up/)).toBeInTheDocument();
    expect(screen.getByText(/At a friend's sleepover, the older kids put on something you know isn't okay/)).toBeInTheDocument();
    expect(screen.getByText(/An adult you know asks you to keep something "just between us"/)).toBeInTheDocument();
  });

  it('sends Buy and Gift to the approved checkout URL and does not offer a PDF', () => {
    renderHoliday();

    expect(HOLIDAY_CHECKOUT_URL).toBe(
      'https://sitchthegame.com?utm_source=sitch-holiday-page&utm_medium=landing&utm_campaign=sitch-holiday',
    );

    const buy = screen.getByRole('link', { name: 'Get Sitch — $6.99' });
    const gift = screen.getByRole('link', { name: 'Gift Sitch' });
    expect(buy).toHaveAttribute('href', HOLIDAY_CHECKOUT_URL);
    expect(gift).toHaveAttribute('href', HOLIDAY_CHECKOUT_URL);

    const download = screen.getByRole('button', { name: 'Download table card — coming soon' });
    expect(download).toBeDisabled();
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument();
    expect(document.querySelector('a[href$=".pdf"]')).toBeNull();
  });
});
