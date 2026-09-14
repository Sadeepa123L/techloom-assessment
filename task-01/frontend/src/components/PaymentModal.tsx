export function PaymentModal({ onSimulate }: { onSimulate: (status: 'SUCCESS' | 'FAILED' | 'TIMEOUT') => void }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Payment</h2>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={() => onSimulate('SUCCESS')}>Success</button>
          <button className="btn btn-danger" onClick={() => onSimulate('FAILED')}>Failed</button>
          <button className="btn" onClick={() => onSimulate('TIMEOUT')}>Timeout</button>
        </div>
      </div>
    </div>
  );
}
