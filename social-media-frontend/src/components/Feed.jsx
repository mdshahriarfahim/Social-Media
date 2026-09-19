import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import PostCard from './PostCard';

function Feed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setPosting(true);
    setError('');
    try {
      await api.createPost({ username: currentUser, content: content.trim(), image: image.trim() });
      setContent('');
      setImage('');
      loadPosts(); // নতুন পোস্ট দেখানোর জন্য তালিকা রিফ্রেশ করলাম
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="main-area">
      <h1 className="page-title">ফিড</h1>

      {error && <div className="error-banner">{error}</div>}

      <form className="composer" onSubmit={handlePost}>
        <textarea
          placeholder={`${currentUser}, মনে কী চলছে?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="composer-footer">
          <input
            type="text"
            placeholder="ছবির লিংক (ঐচ্ছিক)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button className="btn" type="submit" disabled={posting || !content.trim()}>
            পোস্ট করুন
          </button>
        </div>
      </form>

      {loading ? (
        <div className="empty-state">লোড হচ্ছে...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">এখনো কোনো পোস্ট নেই — প্রথম পোস্টটা আপনিই করুন।</div>
      ) : (
        posts.map((post) => (
          <PostCard key={post._id} post={post} currentUser={currentUser} onChange={loadPosts} />
        ))
      )}
    </div>
  );
}

export default Feed;