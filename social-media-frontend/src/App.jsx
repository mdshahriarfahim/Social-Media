import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Messages from './components/Messages';
import UsernameGate from './components/UsernameGate';

function App() {
  const [username, setUsername] = useState(() => localStorage.getItem('khata-username') || '');
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    if (username) localStorage.setItem('khata-username', username);
  }, [username]);

  if (!username) {
    return <UsernameGate onSubmit={setUsername} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        username={username}
        onUsernameChange={setUsername}
      />
      {activeTab === 'feed' ? <Feed currentUser={username} /> : <Messages currentUser={username} />}
    </div>
  );
}

export default App;