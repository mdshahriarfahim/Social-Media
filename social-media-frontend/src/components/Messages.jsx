import { useEffect, useState, useCallback, useRef } from 'react';
import { api } from '../api';
import { socket } from '../socket';

function Messages({ currentUser }) {
  const [conversations, setConversations] = useState([]); // ইনবক্স (কার সাথে শেষ কী কথা হয়েছে)
  const [activeUser, setActiveUser] = useState(null); // এখন কার সাথে চ্যাট খোলা আছে
  const [newChatName, setNewChatName] = useState(''); // নতুন কারো সাথে চ্যাট শুরু করার ইনপুট
  const [chatMessages, setChatMessages] = useState([]); // খোলা চ্যাটের সব মেসেজ
  const [text, setText] = useState(''); // নতুন মেসেজ লেখার ইনপুট
  const bodyRef = useRef(null);

  // socket connect করলাম এবং নিজের নামের room এ join করলাম
  useEffect(() => {
    socket.connect();
    socket.emit('join', currentUser);
    return () => socket.disconnect(); // পেজ ছাড়লে connection বন্ধ করে দিলাম
  }, [currentUser]);

  const loadInbox = useCallback(async () => {
    try {
      const data = await api.getInbox(currentUser);
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  }, [currentUser]);

  useEffect(() => {
    loadInbox();
  }, [loadInbox]);

  const openConversation = useCallback(
    async (otherUser) => {
      setActiveUser(otherUser);
      try {
        const data = await api.getConversation(currentUser, otherUser);
        setChatMessages(data);
      } catch (err) {
        console.error(err);
      }
    },
    [currentUser]
  );

  // অন্য কেউ মেসেজ পাঠালে real-time এ শুনলাম
  useEffect(() => {
    const handleReceive = (msg) => {
      // যদি এই মুহূর্তে সেই ব্যক্তির সাথেই চ্যাট খোলা থাকে, তাহলে সাথে সাথে দেখালাম
      if (msg.sender === activeUser || msg.receiver === activeUser) {
        setChatMessages((prev) => [...prev, msg]);
      }
      loadInbox(); // ইনবক্সের লিস্টও (শেষ মেসেজ) আপডেট করলাম
    };
    socket.on('receiveMessage', handleReceive);
    return () => socket.off('receiveMessage', handleReceive);
  }, [activeUser, loadInbox]);

  // নতুন মেসেজ এলে চ্যাট বক্স নিচে স্ক্রল করলাম
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [chatMessages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !activeUser) return;
    try {
      const newMsg = await api.sendMessage({ sender: currentUser, receiver: activeUser, text: trimmed });
      setChatMessages((prev) => [...prev, newMsg]); // নিজের পাঠানো মেসেজ সাথে সাথে নিজের বক্সেও দেখালাম
      setText('');
      loadInbox();
    } catch (err) {
      console.error(err);
    }
  };

  const startNewChat = (e) => {
    e.preventDefault();
    const name = newChatName.trim();
    if (!name) return;
    setNewChatName('');
    openConversation(name);
  };

  return (
    <div className="main-area" style={{ maxWidth: 760 }}>
      <h1 className="page-title">মেসেজ</h1>

      <div className="messages-shell">
        <div className="conv-list">
          <form className="new-chat-row" onSubmit={startNewChat}>
            <input
              type="text"
              placeholder="নতুন username দিন"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
            />
          </form>

          {conversations.length === 0 && (
            <div style={{ padding: 16, fontSize: 13, color: 'var(--ink-soft)' }}>
              কোনো কথোপকথন নেই — উপরে নাম লিখে শুরু করুন।
            </div>
          )}

          {conversations.map((conv) => {
            const otherUser = conv.sender === currentUser ? conv.receiver : conv.sender;
            return (
              <div
                key={otherUser}
                className={`conv-item ${activeUser === otherUser ? 'active' : ''}`}
                onClick={() => openConversation(otherUser)}
              >
                <div className="conv-name">{otherUser}</div>
                <div className="conv-preview">{conv.text}</div>
              </div>
            );
          })}
        </div>

        <div className="chat-pane">
          {!activeUser ? (
            <div className="chat-placeholder">বাম পাশ থেকে একটা কথোপকথন বেছে নিন</div>
          ) : (
            <>
              <div className="chat-header">{activeUser}</div>
              <div className="chat-body" ref={bodyRef}>
                {chatMessages.map((m) => (
                  <div key={m._id} className={`bubble ${m.sender === currentUser ? 'mine' : 'theirs'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <form className="chat-input-row" onSubmit={handleSend}>
                <input
                  type="text"
                  placeholder="একটা মেসেজ লিখুন..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="btn" type="submit" disabled={!text.trim()}>
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;