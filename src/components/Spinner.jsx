import './Spinner.css';

function Spinner({ message = 'Cargando...' }) {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p className="spinner-message">{message}</p>
    </div>
  );
}

export default Spinner;
