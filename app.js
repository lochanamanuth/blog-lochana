let allPosts = [];
let currentCategory = 'All';

// Load posts metadata from posts.json
async function initBlog() {
    try {
        const response = await fetch('posts.json');
        allPosts = await response.json();
        renderPosts(allPosts);

        // Check URL hash if user opened a direct writeup link
        if (window.location.hash.startsWith('#post=')) {
            const slug = window.location.hash.replace('#post=', '');
            openPost(slug);
        }
    } catch (error) {
        console.error('Error loading posts.json:', error);
        document.getElementById('postsGrid').innerHTML = 
            '<p style="color:#f87171;">Failed to load posts. Make sure posts.json is in the root folder.</p>';
    }
}

function renderPosts(posts) {
    const grid = document.getElementById('postsGrid');
    const emptyState = document.getElementById('emptyState');
    grid.innerHTML = '';

    if (posts.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    emptyState.style.display = 'none';

    posts.forEach(post => {
        const card = document.createElement('div');
        card.className = 'post-card';
        card.onclick = () => openPost(post.slug);

        const tagsHtml = post.tags.map(tag => `<span class="mini-tag">#${tag}</span>`).join('');

        card.innerHTML = `
            <div>
                <div class="card-top">
                    <span class="platform-tag">${post.category}</span>
                    <span class="diff-badge diff-${post.difficulty}">${post.difficulty}</span>
                </div>
                <h2>${post.title}</h2>
                <p>${post.summary}</p>
            </div>
            <div class="card-footer">
                <div class="tags-list">${tagsHtml}</div>
                <span>${post.date}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function setCategory(category) {
    currentCategory = category;
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
    filterPosts();
}

function filterPosts() {
    const query = document.getElementById('searchInput').value.toLowerCase().trim();
    const filtered = allPosts.filter(post => {
        const matchesCat = currentCategory === 'All' || post.category === currentCategory;
        const matchesSearch = 
            post.title.toLowerCase().includes(query) ||
            post.summary.toLowerCase().includes(query) ||
            post.tags.some(t => t.toLowerCase().includes(query));
        return matchesCat && matchesSearch;
    });
    renderPosts(filtered);
}

async function openPost(slug) {
    const post = allPosts.find(p => p.slug === slug);
    if (!post) return;

    try {
        const res = await fetch(`posts/${post.file}`);
        const mdText = await res.text();

        document.getElementById('home-view').style.display = 'none';
        document.getElementById('article-view').style.display = 'block';
        window.location.hash = `post=${slug}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        document.getElementById('articleHeader').innerHTML = `
            <div style="display:flex; gap:10px; align-items:center;">
                <span class="platform-tag">${post.category}</span>
                <span class="diff-badge diff-${post.difficulty}">${post.difficulty}</span>
            </div>
            <h1>${post.title}</h1>
            <div class="article-meta-info">
                <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
                <span><i class="fa-solid fa-user-secret"></i> CobraFang</span>
            </div>
        `;

        // Render Markdown to HTML
        document.getElementById('articleContent').innerHTML = marked.parse(mdText);

        // Apply syntax highlighting & add Copy buttons to code blocks
        document.querySelectorAll('#articleContent pre code').forEach(block => {
            hljs.highlightElement(block);
            const pre = block.parentElement;
            const btn = document.createElement('button');
            btn.className = 'copy-code-btn';
            btn.textContent = 'Copy';
            btn.onclick = () => {
                navigator.clipboard.writeText(block.textContent);
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Copy', 1500);
            };
            pre.appendChild(btn);
        });
    } catch (err) {
        alert('Could not load markdown file: posts/' + post.file);
    }
}

function showHome(e) {
    if (e) e.preventDefault();
    document.getElementById('article-view').style.display = 'none';
    document.getElementById('home-view').style.display = 'block';
    history.pushState("", document.title, window.location.pathname + window.location.search);
}

window.addEventListener('DOMContentLoaded', initBlog);
