// assets/scripts/auth.js

// SHA-256 password hashing (Browser API)
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Handle registration
document.getElementById('signupForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name = e.target.fullName.value.trim();
  const email = e.target.email.value.trim();
  const username = e.target.username.value.trim();
  const password = await hashPassword(e.target.password.value);

  let users = JSON.parse(localStorage.getItem('users') || '[]');

  if (users.find(u => u.username === username)) {
    document.getElementById('signupMessage').textContent = 'Username already exists!';
    return;
  }

  users.push({ name, email, username, password });
  localStorage.setItem('users', JSON.stringify(users));
  document.getElementById('signupMessage').textContent = 'Account created! You can now log in.';
  e.target.reset();
});
// Handle login
document.getElementById('loginForm')?.addEventListener('submit', async function (e) {
  e.preventDefault();
  const username = e.target.username.value.trim();
  const passwordInput = e.target.password.value;
  const hashedPassword = await hashPassword(passwordInput);

  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username && u.password === hashedPassword);

  if (!user) {
    document.getElementById('loginMessage').textContent = 'Invalid credentials!';
    return;
  }

  localStorage.setItem('loggedInUser', JSON.stringify(user));
  document.getElementById('loginMessage').textContent = 'Login successful!';
  setTimeout(() => {
    if (username === 'AugustineK') {
      window.location.href = 'admin.html';
    } else {
      window.location.href = 'dashboard.html';
    }
  }, 1000);
});
// assets/scripts/dashboard.js

const postForm = document.getElementById('postForm');
const userPosts = document.getElementById('userPosts');
const currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!currentUser) window.location.href = 'login.html';

postForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  const text = e.target.text.value.trim();
  const imageFile = e.target.image.files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const newPost = {
      id: Date.now(),
      text,
      image: imageFile ? reader.result : null,
      username: currentUser.username
    };

    let posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(newPost);
    localStorage.setItem('posts', JSON.stringify(posts));
    e.target.reset();
    displayUserPosts();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    reader.onload();
  }
});

function displayUserPosts() {
  const posts = JSON.parse(localStorage.getItem('posts') || '[]');
  const userOnly = posts.filter(post => post.username === currentUser.username);

  userPosts.innerHTML = userOnly.map(post => `
    <div class="post">
      <p>${post.text}</p>
      ${post.image ? `<img src="${post.image}" width="200" />` : ''}
      <small>Posted by ${post.username}</small>
    </div>
  `).join('');
}

function logoutUser() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

displayUserPosts();