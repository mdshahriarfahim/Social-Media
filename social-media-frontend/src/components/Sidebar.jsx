function Sidebar({ activeTab, onTabChange, username, onUsernameChange }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        khata<span>.</span>
      </div>

      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'feed' ? 'active' : ''}`}
          onClick={() => onTabChange('feed')}
        >
          ফিড
        </button>
        <button
          className={`nav-tab ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={() => onTabChange('messages')}
        >
          মেসেজ
        </button>
      </nav>

      <div className="who-am-i">
        <label>আপনি কে?</label>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="আপনার নাম লিখুন"
        />
        <div className="hint">লগইন নেই — নাম বদলালেই নতুন পরিচয়ে পোস্ট হবে</div>
      </div>
    </aside>
  );
}

export default Sidebar;