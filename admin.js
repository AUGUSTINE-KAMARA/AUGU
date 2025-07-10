// assets/scripts/admin.js

const loggedIn = JSON.parse(localStorage.getItem('loggedInUser'));
if (!loggedIn || loggedIn.username !== 'AugustineK') {
  window.location.href = 'login.html';
}

function logoutAdmin() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

// Show all users
const users = JSON.parse(localStorage.getItem('users') || '[]');
document.getElementById('userList').innerHTML = users.map(u => `
  <p><strong>${u.username}</strong> – ${u.email}</p>
`).join('');

// Show all posts with delete buttons
const posts = JSON.parse(localStorage.getItem('posts') || '[]');
document.getElementById('allPosts').innerHTML = posts.map(p => `
  <div class="post">
    <p>${p.text}</p>
    ${p.image ? `<img src="${p.image}" width="200"/>` : ''}
    <small>by ${p.username}</small><br/>
    <button onclick="deletePost(${p.id})">Delete Post</button>
  </div>
`).join('');

// Show all comments with delete buttons
const comments = JSON.parse(localStorage.getItem('comments') || '[]');
document.getElementById('allComments').innerHTML = comments.map((c, i) => `
  <p><strong>${c.username}</strong>: ${c.text}
  <em>[${new Date(c.time).toLocaleString()}]</em>
  <button onclick="deleteComment(${i})">Delete</button></p>
`).join('');

function deletePost(id) {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const updated = posts.filter(p => p.id !== id);
  localStorage.setItem('posts', JSON.stringify(updated));
  location.reload();
}

function deleteComment(index) {
  const comments = JSON.parse(localStorage.getItem('comments') || '[]');
  comments.splice(index, 1);
  localStorage.setItem('comments', JSON.stringify(comments));
  location.reload();
}