import { useState, type FormEvent } from 'react';
import { addVisitor, formatEuro, parseAge, quote, type Category } from './pricing';

const LABELS: Record<Category, string> = { free: 'Free', child: 'Child', adult: 'Adult', senior: 'Senior' };

export function App() {
  const [ages, setAges] = useState<number[]>([]);
  const [ageText, setAgeText] = useState('');
  const [error, setError] = useState('');
  const order = quote(ages);

  function onAdd(event: FormEvent) {
    event.preventDefault();
    const parsed = parseAge(ageText);
    if ('error' in parsed) return setError(parsed.error);
    const added = addVisitor(ages, parsed.age);
    if ('error' in added) return setError(added.error);
    setAges(added.ages);
    setAgeText('');
    setError('');
  }

  function onRemove(index: number) {
    setAges(ages.filter((_, i) => i !== index));
    setError('');
  }

  return (
    <main style={{ fontFamily: 'sans-serif', maxWidth: 480, margin: '2rem auto' }}>
      <h1>Ticket price calculator</h1>

      <form onSubmit={onAdd}>
        <label htmlFor="age">Visitor age</label>{' '}
        <input id="age" data-testid="age-input" value={ageText} onChange={(e) => setAgeText(e.target.value)} />{' '}
        <button type="submit" data-testid="add-visitor-button">Add visitor</button>
      </form>

      {error && <p role="alert" data-testid="age-error">{error}</p>}

      {ages.length === 0 ? (
        <p data-testid="empty-order">Add visitors to see a price</p>
      ) : (
        <>
          <ul>
            {order.lines.map((line, index) => (
              <li key={index} data-testid="visitor-row" data-age={line.age}>
                Age {line.age}: <span data-testid="category-label">{LABELS[line.category]}</span>{' '}
                <span data-testid="ticket-price">{formatEuro(line.cents)}</span>{' '}
                <button
                  type="button"
                  data-testid="remove-visitor-button"
                  aria-label={`Remove visitor aged ${line.age}`}
                  onClick={() => onRemove(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {order.groupDiscount && (
            <p data-testid="group-discount-note">Group discount: 10% off every ticket</p>
          )}
          <p data-testid="order-total">Total: {formatEuro(order.totalCents)}</p>
        </>
      )}
    </main>
  );
}
