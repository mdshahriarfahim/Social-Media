import { useState } from 'react';
import { api } from '../api';

function formatTime(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('bn-BD', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function PostCard({ post, currentUser, onChange }) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [busy, setBusy] = useState(false);

  const liked = post.likes.includes(currentUser);

  const handleLike = async () => {
    setBusy(true);
    try {
      await api.toggleLike(post._id, currentUser);
      onChange(); // পোস্ট লিস্ট আবার লোড করলাম যাতে likes আপডেট দেখা যায়
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setBusy(true);
    try {
      await api.addComment(post._id, { username: currentUser, text });
      setCommentText('');
      setShowComments(true);
      onChange(); // নতুন কমেন্ট দেখানোর জন্য লিস্ট রিফ্রেশ করলাম
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="post-card">
      <div className="post-head">
        <span className="post-author">{post.username}</span>
        <span className="post-time">{formatTime(post.createdAt)}</span>
      </div>

      <p className="post-content">{post.content}</p>

      {post.image ? <img className="post-image" src={post.image} alt="" /> : null}

      <div className="post-actions">
        <button
          className={`action-btn ${liked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={busy}
        >
          {liked ? '♥ লাইক দেওয়া হয়েছে' : '♡ লাইক'} · {post.likes.length}
        </button>
        <button className="action-btn" onClick={() => setShowComments((v) => !v)}>
          কমেন্ট · {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comments">
          {post.comments.length === 0 && (
            <div className="comment-row" style={{ color: 'var(--ink-soft)' }}>
              এখনো কোনো কমেন্ট নেই — প্রথম কমেন্টটা আপনিই করুন।
            </div>
          )}
          {post.comments.map((c) => (
            <div className="comment-row" key={c._id}>
              <b>{c.username}</b> — {c.text}
            </div>
          ))}
          <form className="comment-form" onSubmit={handleComment}>
            <input
              type="text"
              placeholder="একটা কমেন্ট লিখুন..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button className="btn" type="submit" disabled={busy}>
              পাঠান
            </button>
          </form>
        </div>
      )}
    </article>
  );
}

export default PostCard;