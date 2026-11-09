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
    <main className="card">
      <header className="card-header">
        <h1>Ticket price calculator</h1>
        <p className="subtitle">Add each visitor's age to see the ticket prices and the total.</p>
      </header>

      <form className="add-form" onSubmit={onAdd}>
        <label htmlFor="age">Visitor age</label>
        <div className="add-row">
          <input
            id="age"
            data-testid="age-input"
            inputMode="numeric"
            autoComplete="off"
            value={ageText}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? 'age-error' : undefined}
            onChange={(e) => setAgeText(e.target.value)}
          />
          <button type="submit" className="primary" data-testid="add-visitor-button">Add visitor</button>
        </div>
        {error && <p id="age-error" role="alert" className="error" data-testid="age-error">{error}</p>}
      </form>

      {ages.length === 0 ? (
        <p className="empty" data-testid="empty-order">Add visitors to see a price</p>
      ) : (
        <>
          <ul className="visitors">
            {order.lines.map((line, index) => (
              <li key={index} className="visitor" data-testid="visitor-row" data-age={line.age}>
                <span className="visitor-age">Age {line.age}</span>
                <span className={`badge badge-${line.category}`} data-testid="category-label">{LABELS[line.category]}</span>
                <span className="price" data-testid="ticket-price">{formatEuro(line.cents)}</span>
                <button
                  type="button"
                  className="remove"
                  data-testid="remove-visitor-button"
                  aria-label={`Remove visitor ${index + 1}, aged ${line.age}`}
                  onClick={() => onRemove(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="summary">
            {order.groupDiscount && (
              <p className="group-note" data-testid="group-discount-note">Group discount: 10% off every ticket</p>
            )}
            <p className="total" data-testid="order-total">Total: {formatEuro(order.totalCents)}</p>
          </div>
        </>
      )}
    </main>
  );
}
