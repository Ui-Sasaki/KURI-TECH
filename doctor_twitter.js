(function() {
    const STORAGE_KEY = 'mini-twitter-posts';
    let posts = loadPosts();

    // Generate a unique user ID for this visitor
    let currentUserId = localStorage.getItem('mini-twitter-userId');
    if (!currentUserId) {
        currentUserId = Date.now().toString(36) + Math.random().toString(36).slice(2);
        localStorage.setItem('mini-twitter-userId', currentUserId);
    }

    const timeline = document.getElementById('timeline');
    const tweetText = document.getElementById('tweetText');
    const postBtn = document.getElementById('postBtn');
    const charCount = document.getElementById('charCount');
    const imageInput = document.getElementById('imageInput');
    const imgPreview = document.getElementById('imgPreview');
    const attachBtn = document.getElementById('attachBtn');
    const clearBtn = document.getElementById('clearBtn');

    // Character count
    tweetText.addEventListener('input', () => charCount.textContent = `${tweetText.value.length}/280`);
    attachBtn.addEventListener('click', () => imageInput.click());

    // Image preview
    imageInput.addEventListener('change', async e => {
        if (!e.target.files.length) return;
        imgPreview.src = await fileToDataURL(e.target.files[0]);
        imgPreview.style.display = 'block';
        imgPreview.dataset.raw = imgPreview.src;
    });

    clearBtn.addEventListener('click', clearComposer);

    // Post button
    postBtn.addEventListener('click', () => {
        const text = tweetText.value.trim();
        if (!text && !imgPreview.dataset.raw) { 
            alert('テキストまたは画像を入力してください'); 
            return; 
        }

        posts.unshift({
            id: Date.now().toString(36),
            text,
            image: imgPreview.dataset.raw || null,
            date: new Date().toISOString(),
            likes: 0,
            retweets: 0,
            replies: [],
            userId: currentUserId   // Ownership
        });

        savePosts();
        renderPosts();
        clearComposer();
    });

    // Ctrl+Enter to post
    tweetText.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') postBtn.click();
    });

    function renderPosts() {
        timeline.innerHTML = '';
        posts.forEach(p => {
            const postEl = document.createElement('div');
            postEl.className = 'post';

            const avatar = document.createElement('div');
            avatar.className = 'post-avatar';
            avatar.innerHTML = `<img src="images/avatar.png" alt="Anonymous">`;

            const contentContainer = document.createElement('div');
            contentContainer.className = 'post-content-container';

            const header = document.createElement('div');
            header.className = 'post-header';
            header.innerHTML = `
                <div class="username">${p.userId === currentUserId ? 'You' : '匿名'}</div>
                <div class="time">${formatDateShort(p.date)}</div>
            `;

            const content = document.createElement('div');
            content.className = 'post-content';
            content.textContent = p.text;

            contentContainer.appendChild(header);
            contentContainer.appendChild(content);

            if (p.image) {
                const imgEl = document.createElement('img');
                imgEl.src = p.image;
                imgEl.className = 'post-image';
                contentContainer.appendChild(imgEl);
            }

            const actions = document.createElement('div');
            actions.className = 'post-actions';

            // Like button
            const likeBtn = document.createElement('button');
            likeBtn.className = 'btn';
            likeBtn.textContent = `❤️ ${p.likes}`;
            likeBtn.addEventListener('click', () => { p.likes++; savePosts(); renderPosts(); });

            // Retweet button
            const rtBtn = document.createElement('button');
            rtBtn.className = 'btn';
            rtBtn.textContent = `🔁 ${p.retweets}`;
            rtBtn.addEventListener('click', () => { p.retweets++; savePosts(); renderPosts(); });

            // Delete button (only if current user owns post)
            const delBtn = document.createElement('button');
            delBtn.className = 'btn delete-btn';
            delBtn.textContent = '削除';

            if (p.userId === currentUserId) {
                delBtn.addEventListener('click', () => {
                    if (confirm('この投稿を削除しますか？')) {
                        posts = posts.filter(post => post.id !== p.id);
                        savePosts();
                        renderPosts();
                    }
                });
            } else {
                delBtn.style.display = 'none';
            }

            actions.append(likeBtn, rtBtn, delBtn);
            contentContainer.appendChild(actions);

            postEl.appendChild(avatar);
            postEl.appendChild(contentContainer);
            timeline.appendChild(postEl);
        });
    }

    function fileToDataURL(file) {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.onload = () => res(reader.result);
            reader.onerror = rej;
            reader.readAsDataURL(file);
        });
    }

    function clearComposer() {
        tweetText.value = '';
        imgPreview.src = '';
        imgPreview.style.display = 'none';
        delete imgPreview.dataset.raw;
        charCount.textContent = '0/280';
        imageInput.value = '';
    }

    function formatDateShort(iso) {
        return new Date(iso).toLocaleString();
    }

    function savePosts() { localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }
    function loadPosts() { try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; } }

    // Initialize demo post if none
    if (!posts.length) {
        posts = [{
            id: 'demo1',
            text: 'ミニTwitterへようこそ！投稿してみてください。',
            image: null,
            date: new Date().toISOString(),
            likes: 0,
            retweets: 0,
            replies: [],
            userId: currentUserId
        }];
        savePosts();
    }

    renderPosts();
})();
