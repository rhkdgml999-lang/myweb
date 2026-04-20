// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUyqK0cL5lPo0Z-wHdiYd8bFXdwMULDis",
    authDomain: "my-web-db-f0fe3.firebaseapp.com",
    projectId: "my-web-db-f0fe3",
    storageBucket: "my-web-db-f0fe3.firebasestorage.app",
    messagingSenderId: "309646744809",
    appId: "1:309646744809:web:4a154f85a0708b1b5b2478"
};

// Initialize Firebase (Compat version)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);

        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });

        navLinks.forEach(l => l.classList.remove('nav-active'));
        link.classList.add('nav-active');

        // Close mobile menu on click
        const menuBtn = document.getElementById('menu-toggle');
        const linksContainer = document.getElementById('nav-links');
        menuBtn?.classList.remove('open');
        linksContainer?.classList.remove('open');

        window.scrollTo(0, 0);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    // Hamburger menu logic
    const menuBtn = document.getElementById('menu-toggle');
    const linksContainer = document.getElementById('nav-links');

    menuBtn?.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        linksContainer.classList.toggle('open');
    });

    initBoard();
    initTheme();
    initLang();
    initChat();
    initContact();
    initEmailModal();
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

function initEmailModal() {
    const btnOpen = document.getElementById('btn-open-email');
    const btnClose = document.getElementById('btn-close-email');
    const modal = document.getElementById('email-modal');
    const form = document.getElementById('email-form');

    if (btnOpen) {
        btnOpen.onclick = (e) => {
            e.stopPropagation();
            modal.style.display = 'flex';
            const dropdown = document.getElementById('contact-dropdown');
            if (dropdown) dropdown.classList.remove('active');
        };
    }

    if (btnClose) btnClose.onclick = () => modal.style.display = 'none';

    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = '전송 중...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('메일이 성공적으로 전송되었습니다! (데모 시뮬레이션)');
                form.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
                modal.style.display = 'none';
            }, 1500);
        };
    }
}

function initChat() {
    const toggle = document.getElementById('chatbot-toggle');
    const win = document.getElementById('chatbot-window');
    const close = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const send = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');

    if (toggle) toggle.onclick = () => win.style.display = 'flex';
    if (close) close.onclick = () => win.style.display = 'none';

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
    const lang = localStorage.getItem('site_lang') || 'ko';
    const isEn = lang === 'en';

    const keywordMap = {
        '안녕': { ko: '안녕하세요! 한광희님의 비서 프로메테우스입니다. 무엇을 도와드릴까요?', en: "Hello! I am Kwanghee Han's assistant, Prometheus. How can I help you?" },
        'hi': { ko: '안녕하세요! 한광희님의 비서 프로메테우스입니다. 무엇을 도와드릴까요?', en: "Hello! I am Kwanghee Han's assistant, Prometheus. How can I help you?" },
        'who are you': { ko: '저는 한광희님의 ai 비서이자 방어용 보안 ai 그리고 챗봇입니다', en: "I am Kwanghee Han's AI assistant, a defensive security AI, and a chatbot." },
        '너는 누구': { ko: '저는 한광희님의 ai 비서이자 방어용 보안 ai 그리고 챗봇입니다', en: "I am Kwanghee Han's AI assistant, a defensive security AI, and a chatbot." },
        '한광희': { ko: '한광희님은 기본기와 AI를 결합하여 혁신을 설계하는 유지보수 엔지니어입니다.', en: "Kwanghee Han is a maintenance engineer designing innovation with fundamentals and AI." },
        '연락': { ko: '연락처는 오른쪽 상단에 있습니다. 게시판에 글을 남겨주셔도 좋습니다.', en: "Contact info is at the top right, or leave a message on the board." },
        'contact': { ko: '연락처는 오른쪽 상단에 있습니다. 게시판에 글을 남겨주셔도 좋습니다.', en: "Contact info is at the top right, or leave a message on the board." }
    };

    for (let key in keywordMap) {
        if (text.includes(key)) return isEn ? keywordMap[key].en : keywordMap[key].ko;
    }

    return isEn ? "That's an interesting question! I'm still learning." : '흥미로운 질문이네요! 아직은 학습 중인 단계입니다.';
}

function initLang() {
    const langBtn = document.getElementById('lang-toggle');
    const langText = langBtn?.querySelector('.lang-text');
    let currentLang = localStorage.getItem('site_lang') || 'ko';

    setLanguage(currentLang);

    langBtn?.addEventListener('click', () => {
        currentLang = currentLang === 'ko' ? 'en' : 'ko';
        setLanguage(currentLang);
        localStorage.setItem('site_lang', currentLang);
    });

    function setLanguage(lang) {
        if (!langBtn) return;
        langText.innerText = lang.toUpperCase();
        document.querySelectorAll('[data-ko]').forEach(el => {
            const text = el.getAttribute(`data-${lang}`);
            if (text) el.innerHTML = text;
        });
        document.querySelectorAll('[data-ko-placeholder]').forEach(el => {
            const ph = el.getAttribute(`data-${lang}-placeholder`);
            if (ph) el.placeholder = ph;
        });
        document.querySelectorAll('[data-ko-title]').forEach(el => {
            const title = el.getAttribute(`data-${lang}-title`);
            if (title) el.title = title;
        });
    }
}

function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    themeBtn?.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// --- Firebase Board Logic (Compat v8) ---
let posts = [];
let currentPostId = null;

function initBoard() {
    const btnWrite = document.getElementById('btn-write');
    const btnCancel = document.getElementById('btn-cancel');
    const postForm = document.getElementById('post-form');
    const btnEdit = document.getElementById('btn-edit');
    const btnDelete = document.getElementById('btn-delete');

    if (btnWrite) btnWrite.onclick = () => showForm();
    if (btnCancel) btnCancel.onclick = () => hideModals();

    if (postForm) {
        postForm.onsubmit = (e) => {
            e.preventDefault();
            savePost();
        };
    }

    if (btnEdit) btnEdit.onclick = () => editPost();
    if (btnDelete) btnDelete.onclick = () => deletePost();

    // Real-time listener (Compat)
    db.collection("posts").orderBy("serverTimestamp", "desc").onSnapshot((snapshot) => {
        posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderList();
    });
}

function renderList() {
    const listBody = document.getElementById('post-list-body');
    if (!listBody) return;

    listBody.innerHTML = posts.map((post, index) => `
        <tr onclick="viewPost('${post.id}')">
            <td>${posts.length - index}</td>
            <td class="post-title-cell">${post.title} ${post.replies?.length > 0 ? `[${post.replies.length}]` : ''}</td>
            <td>${post.author}</td>
            <td>${post.date}</td>
        </tr>
    `).join('');
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

function savePost() {
    const id = document.getElementById('post-id').value;
    const author = document.getElementById('post-author').value;
    const password = document.getElementById('post-password').value;
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const date = new Date().toLocaleDateString('ko-KR').slice(0, -1);

    if (id) {
        const post = posts.find(p => p.id === id);
        if (post.password !== password) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        db.collection("posts").doc(id).update({ author, title, content, date });
    } else {
        db.collection("posts").add({
            author, password, title, content, date,
            replies: [],
            serverTimestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    }
    hideModals();
}

function viewPost(id) {
    currentPostId = id;
    const post = posts.find(p => p.id === id);
    if (!post) return;

    document.getElementById('view-title').innerText = post.title;
    document.getElementById('view-author').innerText = post.author;
    document.getElementById('view-date').innerText = post.date;
    document.getElementById('view-content').innerText = post.content;

    renderReplies(post.replies || []);
    document.getElementById('board-detail-view').style.display = 'flex';
}

function editPost() {
    showForm(currentPostId);
}

function deletePost() {
    const password = prompt('비밀번호를 입력하세요:');
    const post = posts.find(p => p.id === currentPostId);
    if (post && post.password === password) {
        db.collection("posts").doc(currentPostId).delete();
        hideModals();
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
}

function renderReplies(replies) {
    const container = document.getElementById('replies-container');
    if (!container) return;
    container.innerHTML = replies.length === 0 ? '<p style="color:#888;">댓글이 없습니다.</p>' : '';

    replies.forEach((reply, idx) => {
        const div = document.createElement('div');
        div.className = 'reply-item';
        div.innerHTML = `
            <div class="reply-header">
                <strong>${reply.author}</strong> <span style="font-size:0.8rem; color:#888;">${reply.date}</span>
                <div class="reply-actions" style="display:inline-block; margin-left:10px;">
                    <button class="btn-text" onclick="toggleNestedForm(${idx})" style="color:var(--samsung-blue); border:none; background:none; cursor:pointer;">답글</button>
                    <button class="btn-text" onclick="deleteReply(${idx})" style="color:#ff4444; border:none; background:none; cursor:pointer;">삭제</button>
                </div>
            </div>
            <div class="reply-content" style="margin-top:5px;">${reply.content}</div>
            <div id="nested-form-${idx}" style="display:none; margin-top:10px; padding:10px; background:rgba(0,0,0,0.03); border-radius:10px;">
                <input type="text" id="n-author-${idx}" placeholder="이름" style="width:100px;">
                <input type="password" id="n-password-${idx}" placeholder="PW" style="width:80px;">
                <textarea id="n-content-${idx}" placeholder="답글 내용" style="width:100%; margin-top:5px;"></textarea>
                <button class="btn-small" onclick="submitReply(${idx})" style="margin-top:5px;">등록</button>
            </div>
            <div class="nested-replies" style="margin-left:20px; border-left:2px solid #eee; padding-left:10px; margin-top:10px;">
                ${(reply.replies || []).map((nr, ni) => `
                    <div class="reply-item nested" style="margin-top:5px;">
                        <strong>${nr.author}</strong> <span style="font-size:0.8rem; color:#888;">${nr.date}</span>
                        <div class="reply-content">${nr.content}</div>
                        <button class="btn-text" onclick="deleteReply(${idx}, ${ni})" style="color:#ff4444; border:none; background:none; cursor:pointer; font-size:0.7rem;">삭제</button>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(div);
    });
}

function submitReply(parentIdx = null) {
    let author, password, content;
    if (parentIdx !== null) {
        author = document.getElementById(`n-author-${parentIdx}`).value;
        password = document.getElementById(`n-password-${parentIdx}`).value;
        content = document.getElementById(`n-content-${parentIdx}`).value;
    } else {
        author = document.getElementById('reply-author').value;
        password = document.getElementById('reply-password').value;
        content = document.getElementById('reply-content').value;
    }

    const date = new Date().toLocaleDateString('ko-KR').slice(0, -1);
    const post = posts.find(p => p.id === currentPostId);
    if (!post) return;

    const newReply = { author, password, content, date, replies: [] };
    const updatedReplies = [...(post.replies || [])];

    if (parentIdx !== null) {
        if (!updatedReplies[parentIdx].replies) updatedReplies[parentIdx].replies = [];
        updatedReplies[parentIdx].replies.push(newReply);
    } else {
        updatedReplies.push(newReply);
    }

    db.collection("posts").doc(currentPostId).update({ replies: updatedReplies });
    
    if (parentIdx === null) {
        document.getElementById('reply-author').value = '';
        document.getElementById('reply-password').value = '';
        document.getElementById('reply-content').value = '';
    }
}

function deleteReply(idx, nIdx = null) {
    const password = prompt('비밀번호를 입력하세요:');
    const post = posts.find(p => p.id === currentPostId);
    const updatedReplies = [...post.replies];
    
    let target = nIdx !== null ? updatedReplies[idx].replies[nIdx] : updatedReplies[idx];
    if (target.password === password) {
        if (nIdx !== null) updatedReplies[idx].replies.splice(nIdx, 1);
        else updatedReplies.splice(idx, 1);
        db.collection("posts").doc(currentPostId).update({ replies: updatedReplies });
    } else {
        alert('비밀번호가 일치하지 않습니다.');
    }
}

function toggleNestedForm(idx) {
    const f = document.getElementById(`nested-form-${idx}`);
    f.style.display = f.style.display === 'none' ? 'block' : 'none';
}
