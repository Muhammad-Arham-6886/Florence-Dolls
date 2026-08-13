import { useShop } from '../context/ShopContext';
import './toast.css';

export default function Toast() {
  const { toast } = useShop();

  return (
    <div className={`toast ${toast ? 'toast--visible' : ''}`} role="status" aria-live="polite">
      <span className="toast__mark" aria-hidden="true">&check;</span>
      <span className="toast__text">{toast}</span>
    </div>
  );
}