// Get elements
const blogPostsContainer = document.getElementById('blogPosts');
const form = document.getElementById('postForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Simulated logged-in user
const currentUser = JSON.parse(localStorage.getItem('loggedInUser')) || { username: 'Anonymous' };

// Load posts on page load
document.addEventListener('DOMContentLoaded', loadPosts);

// Add new post
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();

  if (!title || !content) return;

  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts.unshift({
    id: Date.now(),
    title,
    content,
    username: currentUser.username,
    category: 'Stories', // Default category
    tags: [],
    preview: content.slice(0, 100) + '...'
  });

  localStorage.setItem('posts', JSON.stringify(posts));
  form.reset();
  loadPosts();
});

// Load posts and render
function loadPosts() {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const searchTerm = searchInput?.value?.toLowerCase() || '';
  const category = categoryFilter?.value || '';

  const filteredPosts = posts.filter(post =>
    (post.title.toLowerCase().includes(searchTerm) ||
     post.username.toLowerCase().includes(searchTerm)) &&
    (category === '' || post.category === category)
  );

  blogPostsContainer.innerHTML = filteredPosts.map((post, i) => `
    <div class="post-card">
      <h3>${post.title}</h3>
      <p><strong>By ${post.username}</strong></p>
      <p>${post.preview}</p>
      <button onclick="toggleFull(${post.id})">Read More</button>
      <div id="full-${post.id}" style="display:none;">
        <p>${post.content}</p>
        <div class="comments">
          <h4>Comments</h4>
          ${loadComments(post.id).join('')}
          <form onsubmit="addComment(event, ${post.id})">
            <input type="text" name="comment" placeholder="Write a comment" required />
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
      <hr/>
    </div>
  `).join('');
}

// Toggle full post content
function toggleFull(id) {
  const contentDiv = document.getElementById(`full-${id}`);
  contentDiv.style.display = contentDiv.style.display === 'none' ? 'block' : 'none';
}

// Load comments for a post
function loadComments(postId) {
  const comments = JSON.parse(localStorage.getItem('comments')) || [];
  return comments
    .filter(c => c.postId === postId)
    .map(c => `<p><strong>${c.username}</strong>: ${c.text} <em>[${new Date(c.time).toLocaleString()}]</em></p>`);
}

// Add comment to a post
function addComment(e, postId) {
  e.preventDefault();
  const commentText = e.target.comment.value.trim();
  if (!commentText) return;

  const comments = JSON.parse(localStorage.getItem('comments')) || [];
  comments.push({
    postId,
    username: currentUser.username,
    text: commentText,
    time: Date.now()
  });
  localStorage.setItem('comments', JSON.stringify(comments));
  e.target.reset();
  loadPosts();
}

// Listen for filters
if (searchInput) searchInput.addEventListener('input', loadPosts);
if (categoryFilter) categoryFilter.addEventListener('change', loadPosts);