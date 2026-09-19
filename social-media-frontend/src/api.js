// ব্যাকএন্ডের ঠিকানা — লোকালি চালু থাকা Express সার্ভার
export const API_BASE = 'http://localhost:3000';

// সাধারণ fetch wrapper — বারবার JSON header লেখা এড়ানোর জন্য
async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'কিছু একটা ভুল হয়েছে');
  }
  return data;
}

export const api = {
  // ---- Posts ----
  getPosts: () => request('/posts'),
  createPost: (body) => request('/posts', { method: 'POST', body: JSON.stringify(body) }),
  toggleLike: (postId, username) =>
    request(`/posts/${postId}/like`, { method: 'PUT', body: JSON.stringify({ username }) }),
  addComment: (postId, body) =>
    request(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(body) }),
  deletePost: (postId) => request(`/posts/${postId}`, { method: 'DELETE' }),

  // ---- Messages ----
  getInbox: (username) => request(`/messages/inbox/${username}`),
  getConversation: (userA, userB) => request(`/messages/${userA}/${userB}`),
  sendMessage: (body) => request('/messages', { method: 'POST', body: JSON.stringify(body) }),
};