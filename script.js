const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // Update Sections
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });

        // Update Nav Link styling (optional)
        navLinks.forEach(l => l.classList.remove('nav-active'));
        link.classList.add('nav-active');

        // Scroll top just in case
        window.scrollTo(0, 0);
    });
});

// Set Home as default
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('home').classList.add('active');
    initBoard();
    initTheme();
    initLang();
    initChat();
    initContact();
});

function initContact() {
    const toggle = document.getElementById('contact-toggle');
    const dropdown = document.getElementById('contact-dropdown');

    if (toggle && dropdown) {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // Copy functionality
        const copyItems = dropdown.querySelectorAll('.copy-info');
        copyItems.forEach(item => {
            item.addEventListener('click', () => {
                const text = item.getAttribute('data-text');
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = item.innerText;
                    const isKo = localStorage.getItem('site_lang') !== 'en';
                    item.innerText = isKo ? '복사되었습니다!' : 'Copied!';
                    item.style.color = '#00D1FF';
                    
                    setTimeout(() => {
                        item.innerText = originalText;
                        item.style.color = '';
                    }, 2000);
                });
            });
        });
    }
}

function initChat() {
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');

    if (toggle) toggle.onclick = () => window.style.display = 'flex';
    if (close) close.onclick = () => window.style.display = 'none';

    function addMessage(text, isBot = true) {
        const msg = document.createElement('div');
        msg.className = `message ${isBot ? 'bot' : 'user'}`;
        msg.innerHTML = text;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, false);
        input.value = '';

        setTimeout(() => {
            const response = getBotResponse(text);
            addMessage(response, true);
        }, 600);
    }

    if (send) send.onclick = handleSend;
    if (input) {
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleSend();
        };
    }
}

function getBotResponse(input) {
    const text = input.toLowerCase();
    if (text.includes('안녕') || text.includes('하이') || text.includes('hello')) {
        return '안녕하세요! 한광희님의 비서 프로메테우스입니다. 무엇을 도와드릴까요?';
    }
    if (text.includes('누구') || text.includes('한광희')) {
        return '한광희님은 기본기와 AI를 결합하여 혁신을 설계하는 유지보수 엔지니어입니다. 현재 이지피티테크에서 재직 중이십니다.';
    }
    if (text.includes('연락') || text.includes('메일')) {
        return '연락처는 개인정보 보호를 위해 직접 공개하고 있지 않습니다. 게시판에 글을 남겨주시면 전달해 드릴게요!';
    }
    if (text.includes('기술') || text.includes('스택') || text.includes('잘하는')) {
        return 'PLC 프로그래밍, 로봇 제어, 펌웨어 설계, 그리고 최신 AI 활용 능력(Vibe Coding 등)이 한광희님의 핵심 강점입니다.';
    }
    if (text.includes('게시판') || text.includes('보드')) {
        return '상단 메뉴의 "자유게시판"을 통해 소통하실 수 있습니다. 이미지와 파일 첨부도 가능하니 확인해보세요!';
    }
    return '흥미로운 질문이네요! 하지만 제가 아직은 학습 중이라 더 자세한 내용은 한광희님께 직접 확인해보시는 것이 좋을 것 같습니다. 다른 궁금한 점이 있으신가요?';
}

function initLang() {
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn.querySelector('.lang-text');
    let currentLang = localStorage.getItem('site_lang') || 'ko';

    setLanguage(currentLang);

    langBtn.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        setLanguage(currentLang);
        localStorage.setItem('site_lang', currentLang);
    });

    function setLanguage(lang) {
        langText.innerText = lang.toUpperCase();
        document.querySelectorAll('[data-ko]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) {
                // If the element contains spans (like h1), we should be careful. 
                // But for simplicity, we'll replace the text.
                // However, our h1 has a span inside. Let's fix that.
                if (el.tagName === 'H1' && el.querySelector('span')) {
                    // Special handling for the hero h1
                    const originalSpan = el.querySelector('span').outerHTML;
                    // This is complex. Let's just use innerHTML for elements with data attributes if needed.
                    el.innerHTML = text; 
                } else {
                    el.innerText = text;
                }
            }
        });
    }
}

function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check local storage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// --- Board Logic ---
let posts = JSON.parse(localStorage.getItem('portfolio_posts')) || [
    { id: 1, title: '웹사이트 방문을 환영합니다!', author: 'Admin', content: '방명록이나 자유게시판으로 활용해주세요.', date: '2026.04.13', password: 'admin', replies: [] }
];

function initBoard() {
    const btnWrite = document.getElementById('btn-write');
    const btnCancel = document.getElementById('btn-cancel');
    const btnClose = document.getElementById('btn-close');
    const postForm = document.getElementById('post-form');
    const replyForm = document.getElementById('reply-form');
    const btnEdit = document.getElementById('btn-edit');
    const btnDelete = document.getElementById('btn-delete');

    if (btnWrite) btnWrite.onclick = () => showForm();
    if (btnCancel) btnCancel.onclick = () => hideModals();
    if (btnClose) btnClose.onclick = () => hideModals();

    if (postForm) {
        postForm.onsubmit = (e) => {
            e.preventDefault();
            savePost();
        };
    }

    if (replyForm) {
        replyForm.onsubmit = (e) => {
            e.preventDefault();
            saveReply();
        };
    }

    if (btnEdit) btnEdit.onclick = () => editPost();
    if (btnDelete) btnDelete.onclick = () => deletePost();

    renderPosts();
}

function renderPosts() {
    const listBody = document.getElementById('post-list-body');
    if (!listBody) return;

    listBody.innerHTML = posts.map((post, index) => `
        <tr onclick="viewPost(${post.id})">
            <td>${posts.length - index}</td>
            <td class="post-title-cell">${post.title} ${post.replies.length > 0 ? `[${post.replies.length}]` : ''}</td>
            <td>${post.author}</td>
            <td>${post.date}</td>
        </tr>
    `).reverse().join('');
}

function showForm(id = null) {
    const formView = document.getElementById('board-form-view');
    const formTitle = document.getElementById('form-title');
    const postForm = document.getElementById('post-form');
    
    postForm.reset();
    document.getElementById('post-id').value = id || '';
    
    if (id) {
        const post = posts.find(p => p.id === id);
        formTitle.innerText = '게시글 수정';
        document.getElementById('post-author').value = post.author;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-content').value = post.content;
    } else {
        formTitle.innerText = '게시글 작성';
    }
    
    formView.style.display = 'flex';
}

function hideModals() {
    document.getElementById('board-form-view').style.display = 'none';
    document.getElementById('board-detail-view').style.display = 'none';
}

async function savePost() {
    const id = document.getElementById('post-id').value;
    const author = document.getElementById('post-author').value;
    const password = document.getElementById('post-password').value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const fileInput = document.getElementById('post-file');
    const date = new Date().toLocaleDateString('ko-KR').slice(0, -1);

    let fileData = null;
    if (fileInput.files && fileInput.files[0]) {
        fileData = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({
                name: fileInput.files[0].name,
                type: fileInput.files[0].type,
                data: e.target.result
            });
            reader.readAsDataURL(fileInput.files[0]);
        });
    }

    if (id) {
        // Update
        const index = posts.findIndex(p => p.id == id);
        if (posts[index].password !== password) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        // Retain old file if no new file selected
        const updatedFile = fileData || posts[index].file;
        posts[index] = { ...posts[index], author, title, content, date, file: updatedFile };
    } else {
        // Create
        const newPost = {
            id: Date.now(),
            author,
            password,
            title,
            content,
            date,
            file: fileData,
            replies: []
        };
        posts.push(newPost);
    }

    try {
        localStorage.setItem('portfolio_posts', JSON.stringify(posts));
        renderPosts();
        hideModals();
    } catch (e) {
        alert('저장 용량이 초과되었습니다. 더 작은 파일을 선택해주세요!');
    }
}

let currentPostId = null;

function viewPost(id) {
    currentPostId = id;
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('view-title').innerText = post.title;
    document.getElementById('view-author').innerText = post.author;
    document.getElementById('view-date').innerText = post.date;
    document.getElementById('view-content').innerText = post.content;
    
    // Render Attachment
    const attachArea = document.getElementById('view-attachment');
    attachArea.innerHTML = '';
    if (post.file) {
        if (post.file.type.startsWith('image/')) {
            attachArea.innerHTML = `
                <img src="${post.file.data}" style="max-width: 100%; border-radius: 10px; margin-bottom: 10px;">
                <p style="font-size: 0.8rem;"><i class="fas fa-file"></i> ${post.file.name}</p>
            `;
        } else {
            attachArea.innerHTML = `
                <a href="${post.file.data}" download="${post.file.name}" class="btn-small" style="text-decoration: none;">
                    파일 다운로드 (${post.file.name})
                </a>
            `;
        }
    } else {
        attachArea.style.display = 'none';
    }
    if (post.file) attachArea.style.display = 'block';

    renderReplies(post.replies);
    
    document.getElementById('board-detail-view').style.display = 'flex';
}

function renderReplies(replies) {
    const replyList = document.getElementById('reply-list');
    replyList.innerHTML = replies.map((r, i) => `
        <div class="reply-item">
            <div class="reply-header">
                <span>${r.author} (${r.date})</span>
                <div>
                    <button class="btn-text" onclick="showNestedForm(${i})" style="color: var(--samsung-blue); border:none; background:none; cursor:pointer; font-size:0.7rem; margin-right:5px;">답글</button>
                    <button class="btn-text" onclick="deleteReply(${i})" style="color: #ff4444; border:none; background:none; cursor:pointer; font-size:0.7rem;">삭제</button>
                </div>
            </div>
            <div class="reply-content">${r.content}</div>
            
            <!-- Nested Replies -->
            <div class="nested-replies" style="margin-left: 20px; border-left: 2px solid #ddd; padding-left: 10px; margin-top: 10px;">
                ${(r.replies || []).map((nr, ni) => `
                    <div class="reply-item nested">
                        <div class="reply-header">
                            <span>${nr.author} (${nr.date})</span>
                            <button class="btn-text" onclick="deleteReply(${i}, ${ni})" style="color: #ff4444; border:none; background:none; cursor:pointer; font-size:0.7rem;">삭제</button>
                        </div>
                        <div class="reply-content">${nr.content}</div>
                    </div>
                `).join('')}
            </div>

            <!-- Nested Reply Form (Hidden) -->
            <div id="nested-form-${i}" style="display: none; margin-top: 10px; margin-left: 20px;">
                <form onsubmit="event.preventDefault(); saveReply(${i})">
                    <div class="form-row">
                        <input type="text" id="n-author-${i}" placeholder="이름" required style="font-size: 0.8rem; padding: 5px;">
                        <input type="password" id="n-password-${i}" placeholder="PW" required style="font-size: 0.8rem; padding: 5px;">
                    </div>
                    <textarea id="n-content-${i}" placeholder="답글의 답글을 남겨주세요" required style="font-size: 0.8rem; padding: 5px; width: 100%; min-height: 50px;"></textarea>
                    <button type="submit" class="btn-small" style="padding: 3px 8px; font-size: 0.7rem;">등록</button>
                    <button type="button" onclick="showNestedForm(${i}, false)" style="padding: 3px 8px; font-size: 0.7rem; background:#eee; border:none; border-radius:5px; cursor:pointer;">취소</button>
                </form>
            </div>
        </div>
    `).join('');
}

function showNestedForm(index, show = true) {
    document.getElementById(`nested-form-${index}`).style.display = show ? 'block' : 'none';
}

function saveReply(parentIndex = null) {
    let author, password, content;
    
    if (parentIndex !== null) {
        author = document.getElementById(`n-author-${parentIndex}`).value;
        password = document.getElementById(`n-password-${parentIndex}`).value;
        content = document.getElementById(`n-content-${parentIndex}`).value;
    } else {
        author = document.getElementById('reply-author').value;
        password = document.getElementById('reply-password').value;
        content = document.getElementById('reply-content').value;
    }
    
    const date = new Date().toLocaleDateString('ko-KR').slice(0, -1);
    const postIndex = posts.findIndex(p => p.id === currentPostId);
    
    const newReply = { author, password, content, date, replies: [] };

    if (parentIndex !== null) {
        if (!posts[postIndex].replies[parentIndex].replies) {
            posts[postIndex].replies[parentIndex].replies = [];
        }
        posts[postIndex].replies[parentIndex].replies.push(newReply);
    } else {
        posts[postIndex].replies.push(newReply);
    }

    localStorage.setItem('portfolio_posts', JSON.stringify(posts));
    viewPost(currentPostId);
    if (parentIndex === null) document.getElementById('reply-form').reset();
    renderPosts();
}

function deleteReply(index, nestedIndex = null) {
    const password = prompt('비밀번호를 입력하세요.');
    if (!password) return;

    const postIndex = posts.findIndex(p => p.id === currentPostId);
    let targetReply;
    
    if (nestedIndex !== null) {
        targetReply = posts[postIndex].replies[index].replies[nestedIndex];
    } else {
        targetReply = posts[postIndex].replies[index];
    }

    if (targetReply.password === password) {
        if (nestedIndex !== null) {
            posts[postIndex].replies[index].replies.splice(nestedIndex, 1);
        } else {
            posts[postIndex].replies.splice(index, 1);
        }
        localStorage.setItem('portfolio_posts', JSON.stringify(posts));
        viewPost(currentPostId);
        renderPosts();
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
}

function editPost() {
    hideModals();
    showForm(currentPostId);
}

function deletePost() {
    const password = prompt('게시글 비밀번호를 입력하세요.');
    if (!password) return;

    const index = posts.findIndex(p => p.id === currentPostId);
    if (posts[index].password === password) {
        posts.splice(index, 1);
        localStorage.setItem('portfolio_posts', JSON.stringify(posts));
        renderPosts();
        hideModals();
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
}
