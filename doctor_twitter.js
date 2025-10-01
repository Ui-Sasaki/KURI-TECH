const tweetText = document.getElementById("tweetText");
const charCount = document.getElementById("charCount");
const postBtn = document.getElementById("postBtn");
const attachBtn = document.getElementById("attachBtn");
const clearBtn = document.getElementById("clearBtn");
const imageInput = document.getElementById("imageInput");
const imgPreview = document.getElementById("imgPreview");
const timeline = document.getElementById("timeline");

// --- Identify user (simple per-browser ID) ---
let userId = localStorage.getItem("witdoc_userId");
if (!userId) {
  userId = "user-" + Date.now();
  localStorage.setItem("witdoc_userId", userId);
}

// --- LocalStorage helpers ---
function savePosts(posts) {
  localStorage.setItem("witdoc_posts", JSON.stringify(posts));
}

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem("witdoc_posts")) || [];
  posts.forEach(postData => addPostToTimeline(postData, false));
  if (posts.length > 0) {
    const placeholder = timeline.querySelector(".placeholder");
    if (placeholder) placeholder.remove();
  }
  return posts;
}

function saveVotes(votes) {
  localStorage.setItem("witdoc_votes", JSON.stringify(votes));
}

function loadVotes() {
  return JSON.parse(localStorage.getItem("witdoc_votes")) || {};
}

// --- Add post to timeline ---
function addPostToTimeline(postData, save = true) {
  const { text, imgSrc, timestamp, likes = 0, comments = [], authorId } = postData;

  const placeholder = timeline.querySelector(".placeholder");
  if (placeholder) placeholder.remove();

  const post = document.createElement("div");
  post.classList.add("post");

  let html = `<p>${text}</p>`;
  if (imgSrc) html += `<img src="${imgSrc}" alt="Post Image">`;
  html += `<small class="timestamp">${new Date(timestamp).toLocaleString()}</small>`;

  // Like, Comment (+ Delete if owner)
  html += `
    <div class="post-actions">
      <button class="like-btn">❤️ Like (<span class="like-count">${likes}</span>)</button>
      <button class="comment-btn">💬 Comment</button>
      ${authorId === userId ? `<button class="delete-btn">🗑️ Delete</button>` : ""}
    </div>
    <div class="comments"></div>
    <div class="comment-input" style="display:none;">
      <input type="text" placeholder="Write a comment...">
      <button class="btn post-comment-btn">Post</button>
    </div>
  `;

  post.innerHTML = html;
  timeline.prepend(post);

  const postId = timestamp;
  let votes = loadVotes();
  if (!votes[postId]) votes[postId] = { like: false };

  const likeBtn = post.querySelector(".like-btn");
  const likeCount = post.querySelector(".like-count");

  // Like toggle
  likeBtn.addEventListener("click", () => {
    if (votes[postId].like) {
      postData.likes--;
      votes[postId].like = false;
    } else {
      postData.likes++;
      votes[postId].like = true;
    }
    likeCount.textContent = postData.likes;
    saveVotes(votes);
    savePosts(allPosts);
  });

  // Comments
  const commentBtn = post.querySelector(".comment-btn");
  const commentInput = post.querySelector(".comment-input");
  const commentsDiv = post.querySelector(".comments");
  const postCommentBtn = post.querySelector(".post-comment-btn");

  comments.forEach(c => {
    const p = document.createElement("p");
    p.textContent = c;
    commentsDiv.appendChild(p);
  });

  commentBtn.addEventListener("click", () => {
    commentInput.style.display =
      commentInput.style.display === "none" ? "block" : "none";
  });

  postCommentBtn.addEventListener("click", () => {
    const input = commentInput.querySelector("input");
    const comment = input.value.trim();
    if (comment) {
      const p = document.createElement("p");
      p.textContent = comment;
      commentsDiv.appendChild(p);
      postData.comments.push(comment);
      input.value = "";
      savePosts(allPosts);
    }
  });

  // Delete post (only if owner)
  const deleteBtn = post.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      allPosts = allPosts.filter(p => p.timestamp !== postData.timestamp);
      savePosts(allPosts);
      post.remove();
      if (allPosts.length === 0) {
        timeline.innerHTML = `<p class="placeholder">There are no posts yet.</p>`;
      }
    });
  }

  if (save) {
    allPosts.unshift(postData);
    savePosts(allPosts);
  }
}

// --- Global posts array ---
let allPosts = loadPosts();

// Character counter
tweetText.addEventListener("input", () => {
  charCount.textContent = `${tweetText.value.length}/280`;
});

// Attach image
attachBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imgPreview.src = e.target.result;
      imgPreview.style.display = "block"; 
    };
    reader.readAsDataURL(file);
  }
});

// Clear post
clearBtn.addEventListener("click", () => {
  tweetText.value = "";
  charCount.textContent = "0/280";
  imgPreview.style.display = "none";
  imgPreview.src = "";
  imageInput.value = "";
});

// Post new message
postBtn.addEventListener("click", () => {
  const text = tweetText.value.trim();
  const imgSrc = imgPreview.style.display === "block" ? imgPreview.src : null;

  if (!text && !imgSrc) {
    alert("Nothing to post!");
    return;
  }

  const postData = {
    text,
    imgSrc,
    timestamp: Date.now(),
    likes: 0,
    comments: [],
    authorId: userId
  };

  addPostToTimeline(postData, true);

  // Reset composer
  tweetText.value = "";
  charCount.textContent = "0/280";
  imgPreview.style.display = "none";
  imgPreview.src = "";
  imageInput.value = "";
});
