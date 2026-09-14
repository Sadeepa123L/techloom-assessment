export function PaymentModal({ onSimulate }: { onSimulate: (status: 'SUCCESS' | 'FAILED' | 'TIMEOUT') => void }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Simulate Payment</h2>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={() => onSimulate('SUCCESS')}>Simulate Success</button>
          <button className="btn btn-danger" onClick={() => onSimulate('FAILED')}>Simulate Failure</button>
          <button className="btn" onClick={() => onSimulate('TIMEOUT')}>Simulate Timeout</button>
        </div>
      </div>
    </div>
  );
}
