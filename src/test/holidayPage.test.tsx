import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import Holiday, { HOLIDAY_CHECKOUT_URL } from '../pages/Holiday';

const renderHoliday = () =>
  render(
    <HelmetProvider>
      <Holiday />
    </HelmetProvider>,
  );

const LONG_DASH = /[—–]/;

describe('holiday landing page', () => {
  it("uses Kerry's sales copy, four approved table-card questions, and no long dashes", () => {
    renderHoliday();

    expect(screen.getByText('Holiday family game night')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: "Would your kids make safe choices when you're not around?" })).toBeInTheDocument();
    expect(screen.getByText('Play Sitch, the fun family game that turns real-life possible situations into valuable conversations.')).toBeInTheDocument();
    expect(screen.getByText('Before Sitch:')).toBeInTheDocument();
    expect(screen.getByText(/No idea how your child will respond to situations when you aren't there/)).toBeInTheDocument();
    expect(screen.getByText('After Sitch:')).toBeInTheDocument();
    expect(screen.getByText(/Understand exactly how your child processes real-life situations/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Not Lecturing. Playing!' })).toBeInTheDocument();
    expect(screen.getByText(/Discover what your kids would choose and why/)).toBeInTheDocument();
    expect(screen.getByText(/Sitch was created by a filmmaker with 25 years in the film industry/)).toBeInTheDocument();
    expect(screen.getByText(/Four age groups \(ages 4 to 6, 7 to 9, 10\+, and teens\)/)).toBeInTheDocument();
    expect(screen.getByText('Peer pressure')).toBeInTheDocument();
    expect(screen.getByText('Common sense...or is it?')).toBeInTheDocument();

    expect(screen.getByText(/\$6\.99, one time\. It arrives in your inbox, no shipping/)).toBeInTheDocument();
    expect(screen.getByText('Sitch is a game, not a replacement for therapy or a medically endorsed product.')).toBeInTheDocument();
    expect(screen.getByText(/20% of net proceeds are donated to completing/)).toBeInTheDocument();

    expect(screen.queryByText('Draft')).not.toBeInTheDocument();
    expect(screen.queryByText(/placeholder/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/pending approval/i)).not.toBeInTheDocument();
    expect(screen.getByText(/A classmate shows you a group chat making fun of another kid/)).toBeInTheDocument();
    expect(screen.getByText(/Someone you met in a game says they're your age/)).toBeInTheDocument();
    expect(screen.getByText(/A grown-up you don't know says Mom sent them to pick you up, and they know your name. What do you do\?$/)).toBeInTheDocument();
    expect(screen.queryByText(/family code word/i)).not.toBeInTheDocument();
    expect(screen.getByText(/An adult you know asks you to keep something "just between us"/)).toBeInTheDocument();
    expect(screen.queryByText(/Sleepover/)).not.toBeInTheDocument();
    expect(screen.queryByText(/At a friend's sleepover/)).not.toBeInTheDocument();

    const pageText = document.body.textContent ?? '';
    expect(pageText).not.toMatch(LONG_DASH);
  });

  it('sends Buy and Gift to the approved checkout URL, links Open Secret, and does not offer a PDF', () => {
    renderHoliday();

    expect(HOLIDAY_CHECKOUT_URL).toBe(
      'https://sitchthegame.com?utm_source=sitch-holiday-page&utm_medium=landing&utm_campaign=sitch-holiday',
    );

    const buy = screen.getByRole('link', { name: 'Get Sitch, $6.99' });
    const gift = screen.getByRole('link', { name: 'Gift Sitch' });
    expect(buy).toHaveAttribute('href', HOLIDAY_CHECKOUT_URL);
    expect(gift).toHaveAttribute('href', HOLIDAY_CHECKOUT_URL);

    const openSecretLinks = screen.getAllByRole('link', { name: 'Open Secret' });
    expect(openSecretLinks.length).toBeGreaterThanOrEqual(1);
    for (const link of openSecretLinks) {
      expect(link).toHaveAttribute('href', 'https://opensecretthefilm.com');
    }

    expect(screen.queryByRole('button', { name: /download table card/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /download/i })).not.toBeInTheDocument();
    expect(document.querySelector('a[href$=".pdf"]')).toBeNull();
  });
});
