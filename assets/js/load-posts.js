// Dynamically load and render posts for the Reflections section
(async function() {
    const container = document.getElementById('reflections-posts');
    if (!container) return;

    // Path to manifest listing all post JSON files
    const manifestUrl = 'posts/posts.json';
    let postFiles = [];
    try {
        const manifestResp = await fetch(manifestUrl);
        if (!manifestResp.ok) throw new Error('Manifest not found');
        postFiles = await manifestResp.json(); // Expecting an array of filenames
    } catch (e) {
        container.innerHTML = '<p style="color: #e53e3e;">Could not load posts manifest.</p>';
        return;
    }

    if (!Array.isArray(postFiles) || postFiles.length === 0) {
        container.innerHTML = '<p style="color: #718096;">No reflections found.</p>';
        return;
    }

    // Fetch all posts in parallel
    const postPromises = postFiles.map(file => fetch('posts/' + file).then(r => r.json()).catch(() => null));
    const posts = (await Promise.all(postPromises)).filter(Boolean);

    if (posts.length === 0) {
        container.innerHTML = '<p style="color: #718096;">No reflections found.</p>';
        return;
    }

    // Sort posts by date descending
    posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    container.innerHTML = '';
    posts.forEach(post => {
        const article = document.createElement('article');
        article.className = 'post-card';

        // Meta
        const meta = document.createElement('div');
        meta.className = 'post-meta';
        meta.innerHTML = `
            <span class="post-date">${post.date ? new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
            <span class="post-category">${post.category || ''}</span>
        `;
        article.appendChild(meta);

        // Title
        const title = document.createElement('a');
        title.className = 'post-title';
        title.href = '#';
        title.textContent = post.title || '';
        article.appendChild(title);

        // Excerpt
        const excerpt = document.createElement('p');
        excerpt.className = 'post-excerpt';
        excerpt.textContent = post.excerpt || '';
        article.appendChild(excerpt);

        // Demo link
        if (post.demo) {
            const demo = document.createElement('div');
            demo.className = 'demo-embed';
            demo.innerHTML = `<a href="${post.demo}" target="_blank">[Interactive Demo]</a>`;
            article.appendChild(demo);
        }

        // Read more toggle
        if (post.content) {
            const readMore = document.createElement('button');
            readMore.textContent = 'Read more';
            readMore.style = 'margin-top: 0.5rem; background: none; color: #3182ce; border: none; cursor: pointer; font-size: 0.95em;';
            let expanded = false;
            const contentDiv = document.createElement('div');
            contentDiv.style.display = 'none';
            contentDiv.innerHTML = post.content;
            article.appendChild(readMore);
            article.appendChild(contentDiv);
            readMore.onclick = function() {
                expanded = !expanded;
                contentDiv.style.display = expanded ? 'block' : 'none';
                readMore.textContent = expanded ? 'Show less' : 'Read more';
            };
        }

        // Tags
        if (Array.isArray(post.tags) && post.tags.length > 0) {
            const tagsDiv = document.createElement('div');
            tagsDiv.style = 'margin-top: 0.5rem; color: #718096; font-size: 0.85em;';
            tagsDiv.textContent = 'Tags: ' + post.tags.join(', ');
            article.appendChild(tagsDiv);
        }

        container.appendChild(article);
    });
})(); 