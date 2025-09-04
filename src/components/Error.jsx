export default function Error({ message, retry }) {
  return (
    <div className="card">
      <p>⚠️ {message}</p>
      {retry && <button onClick={retry} style={{ marginTop: 10 }}>Retry</button>}
    </div>
  );
}
