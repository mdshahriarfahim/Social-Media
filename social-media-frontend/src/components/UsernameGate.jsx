import { useState } from 'react';

function UsernameGate({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSubmit(trimmed);
  };

  return (
    <div className="gate-overlay">
      <form className="gate-card" onSubmit={handleSubmit}>
        <h2>স্বাগতম</h2>
        <p>লগইন নেই — শুধু আপনার নামটা লিখুন, তাহলেই পোস্ট আর মেসেজ করতে পারবেন।</p>
        <input
          autoFocus
          type="text"
          placeholder="যেমন: karim"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="btn" style={{ width: '100%' }}>
          শুরু করুন
        </button>
      </form>
    </div>
  );
}

export default UsernameGate;