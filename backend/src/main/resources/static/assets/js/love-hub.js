(function () {
    'use strict';

    const modal = document.getElementById('memory-tool-modal');
    const content = document.getElementById('memory-tool-content');
    const title = document.getElementById('memory-tool-title');
    const kicker = document.getElementById('memory-tool-kicker');
    const toolNames = {
        diary: ['Lời nhắn mỗi ngày', 'Nhật ký chung'],
        gallery: ['Khoảnh khắc của hai ta', 'Kho ảnh'],
        plans: ['Cùng nhau tiến về phía trước', 'Kế hoạch tương lai'],
        gifts: ['Gửi gắm yêu thương', 'Quà tặng']
    };
    const storageKeys = {
        diary: 'loveHub.diary',
        gallery: 'loveHub.gallery',
        plans: 'loveHub.plans',
        gifts: 'loveHub.gifts'
    };
    let activeTool = null;

    const readItems = (tool) => {
        try {
            const value = JSON.parse(localStorage.getItem(storageKeys[tool]));
            return Array.isArray(value) ? value : [];
        } catch {
            return [];
        }
    };

    const writeItems = (tool, items) => {
        localStorage.setItem(storageKeys[tool], JSON.stringify(items));
    };

    const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const formatDate = (value) => new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    }).format(new Date(value));

    const emptyState = (text) => {
        const element = document.createElement('div');
        element.className = 'memory-empty';
        element.textContent = text;
        return element;
    };

    const deleteButton = (id, label = 'Xóa') => {
        const button = document.createElement('button');
        button.className = 'memory-entry__delete';
        button.type = 'button';
        button.dataset.deleteId = id;
        button.setAttribute('aria-label', label);
        button.innerHTML = '<i class="fa-solid fa-trash"></i>';
        return button;
    };

    const renderDiary = () => {
        content.innerHTML = `
            <form class="memory-tool-form" id="memory-diary-form">
                <input class="memory-tool-input" id="memory-diary-title" maxlength="80" placeholder="Tiêu đề của ngày hôm nay" required>
                <textarea class="memory-tool-textarea" id="memory-diary-text" maxlength="1000" placeholder="Viết một điều mà hai bạn muốn ghi nhớ..." required></textarea>
                <button class="memory-tool-submit" type="submit"><i class="fa-solid fa-pen"></i> Lưu trang nhật ký</button>
            </form>
            <div class="memory-tool-list" id="memory-diary-list"></div>`;

        const list = document.getElementById('memory-diary-list');
        const renderList = () => {
            const items = readItems('diary');
            list.replaceChildren();
            if (!items.length) return list.appendChild(emptyState('Chưa có trang nhật ký nào. Hãy viết dòng đầu tiên nhé ♡'));
            items.slice().reverse().forEach((item) => {
                const entry = document.createElement('article');
                entry.className = 'memory-entry';
                const body = document.createElement('div');
                body.className = 'memory-entry__content';
                const heading = document.createElement('strong');
                heading.className = 'memory-entry__title';
                heading.textContent = item.title;
                const text = document.createElement('p');
                text.className = 'memory-entry__text';
                text.textContent = item.text;
                const meta = document.createElement('p');
                meta.className = 'memory-entry__meta';
                meta.textContent = formatDate(item.createdAt);
                body.append(heading, text, meta);
                entry.append(body, deleteButton(item.id, 'Xóa trang nhật ký'));
                list.appendChild(entry);
            });
        };

        document.getElementById('memory-diary-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const diaryTitle = document.getElementById('memory-diary-title');
            const diaryText = document.getElementById('memory-diary-text');
            const items = readItems('diary');
            items.push({ id: createId(), title: diaryTitle.value.trim(), text: diaryText.value.trim(), createdAt: new Date().toISOString() });
            writeItems('diary', items);
            event.currentTarget.reset();
            renderList();
        });
        list.addEventListener('click', (event) => {
            const button = event.target.closest('[data-delete-id]');
            if (!button) return;
            writeItems('diary', readItems('diary').filter((item) => item.id !== button.dataset.deleteId));
            renderList();
        });
        renderList();
    };

    const renderGallery = () => {
        content.innerHTML = `
            <div class="memory-tool-form">
                <label class="memory-tool-submit memory-file-button"><i class="fa-solid fa-image"></i> Thêm ảnh
                    <input id="memory-gallery-file" type="file" accept="image/jpeg,image/png,image/webp">
                </label>
                <p class="memory-tool-help">Ảnh được lưu riêng trong trình duyệt này. Tối đa 6 ảnh, mỗi ảnh không quá 1,5 MB.</p>
                <p class="memory-tool-toast" id="memory-gallery-toast" role="status"></p>
            </div>
            <div class="memory-gallery-grid" id="memory-gallery-grid"></div>`;
        const grid = document.getElementById('memory-gallery-grid');
        const toast = document.getElementById('memory-gallery-toast');

        const renderGrid = () => {
            const items = readItems('gallery');
            grid.replaceChildren();
            if (!items.length) return grid.appendChild(emptyState('Kho ảnh đang chờ khoảnh khắc đầu tiên.'));
            items.forEach((item) => {
                const figure = document.createElement('figure');
                figure.className = 'memory-gallery-item';
                const image = document.createElement('img');
                image.src = item.src;
                image.alt = item.name || 'Kỷ niệm của chúng mình';
                figure.append(image, deleteButton(item.id, 'Xóa ảnh'));
                grid.appendChild(figure);
            });
        };

        document.getElementById('memory-gallery-file').addEventListener('change', (event) => {
            const file = event.target.files[0];
            toast.textContent = '';
            if (!file) return;
            const items = readItems('gallery');
            if (items.length >= 6) {
                toast.textContent = 'Kho ảnh đã đủ 6 tấm. Hãy xóa bớt một ảnh trước.';
                return;
            }
            if (file.size > 1.5 * 1024 * 1024) {
                toast.textContent = 'Ảnh lớn hơn 1,5 MB. Hãy chọn ảnh nhẹ hơn.';
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    items.push({ id: createId(), name: file.name, src: reader.result, createdAt: new Date().toISOString() });
                    writeItems('gallery', items);
                    toast.textContent = 'Đã thêm ảnh vào kho kỷ niệm ♡';
                    renderGrid();
                } catch {
                    toast.textContent = 'Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt ảnh cũ.';
                }
            };
            reader.readAsDataURL(file);
        });
        grid.addEventListener('click', (event) => {
            const button = event.target.closest('[data-delete-id]');
            if (!button) return;
            writeItems('gallery', readItems('gallery').filter((item) => item.id !== button.dataset.deleteId));
            renderGrid();
        });
        renderGrid();
    };

    const renderChecklist = (tool) => {
        const isGift = tool === 'gifts';
        const placeholder = isGift ? 'Tên món quà hoặc dịp đặc biệt' : 'Kế hoạch tiếp theo của hai bạn';
        const emptyMessage = isGift ? 'Chưa có món quà nào được ghi lại.' : 'Chưa có kế hoạch nào. Cùng nhau thêm một dự định nhé ♡';
        content.innerHTML = `
            <form class="memory-tool-form" id="memory-checklist-form">
                <div class="memory-tool-row">
                    <input class="memory-tool-input" id="memory-checklist-title" maxlength="100" placeholder="${placeholder}" required>
                    <button class="memory-tool-submit" type="submit"><i class="fa-solid fa-plus"></i> Thêm</button>
                </div>
                <input class="memory-tool-input" id="memory-checklist-note" maxlength="220" placeholder="Ghi chú (không bắt buộc)">
            </form>
            <div class="memory-tool-list" id="memory-checklist-list"></div>`;
        const list = document.getElementById('memory-checklist-list');

        const renderList = () => {
            const items = readItems(tool);
            list.replaceChildren();
            if (!items.length) return list.appendChild(emptyState(emptyMessage));
            items.slice().reverse().forEach((item) => {
                const entry = document.createElement('article');
                entry.className = `memory-entry${item.done ? ' is-done' : ''}`;
                const toggle = document.createElement('button');
                toggle.className = `memory-entry__toggle${item.done ? ' is-done' : ''}`;
                toggle.type = 'button';
                toggle.dataset.toggleId = item.id;
                toggle.setAttribute('aria-label', item.done ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành');
                toggle.innerHTML = `<i class="fa-solid fa-${item.done ? 'check' : 'circle'}"></i>`;
                const body = document.createElement('div');
                body.className = 'memory-entry__content';
                const heading = document.createElement('strong');
                heading.className = 'memory-entry__title';
                heading.textContent = item.title;
                const note = document.createElement('p');
                note.className = 'memory-entry__text';
                note.textContent = item.note || (isGift ? 'Một món quà chứa đầy yêu thương.' : 'Cùng nhau thực hiện nhé.');
                body.append(heading, note);
                entry.append(toggle, body, deleteButton(item.id));
                list.appendChild(entry);
            });
        };

        document.getElementById('memory-checklist-form').addEventListener('submit', (event) => {
            event.preventDefault();
            const itemTitle = document.getElementById('memory-checklist-title');
            const note = document.getElementById('memory-checklist-note');
            const items = readItems(tool);
            items.push({ id: createId(), title: itemTitle.value.trim(), note: note.value.trim(), done: false, createdAt: new Date().toISOString() });
            writeItems(tool, items);
            event.currentTarget.reset();
            renderList();
        });
        list.addEventListener('click', (event) => {
            const deleteTarget = event.target.closest('[data-delete-id]');
            const toggleTarget = event.target.closest('[data-toggle-id]');
            let items = readItems(tool);
            if (deleteTarget) items = items.filter((item) => item.id !== deleteTarget.dataset.deleteId);
            if (toggleTarget) items = items.map((item) => item.id === toggleTarget.dataset.toggleId ? { ...item, done: !item.done } : item);
            if (!deleteTarget && !toggleTarget) return;
            writeItems(tool, items);
            renderList();
        });
        renderList();
    };

    const openTool = (tool) => {
        if (!modal || !content || !toolNames[tool]) return;
        activeTool = tool;
        kicker.textContent = toolNames[tool][0];
        title.textContent = toolNames[tool][1];
        if (tool === 'diary') renderDiary();
        if (tool === 'gallery') renderGallery();
        if (tool === 'plans' || tool === 'gifts') renderChecklist(tool);
        modal.hidden = false;
        document.documentElement.style.overflow = 'hidden';
        modal.querySelector('[data-close-memory-tool]:last-child')?.focus();
    };

    const closeTool = () => {
        if (!modal) return;
        modal.hidden = true;
        document.documentElement.style.overflow = '';
        document.querySelector(`[data-memory-tool="${activeTool}"]`)?.focus();
        activeTool = null;
    };

    document.querySelectorAll('[data-memory-tool]').forEach((button) => {
        button.addEventListener('click', () => openTool(button.dataset.memoryTool));
    });
    modal?.querySelectorAll('[data-close-memory-tool]').forEach((button) => button.addEventListener('click', closeTool));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && !modal.hidden) closeTool();
    });

    const updateMilestone = (config) => {
        const start = new Date(config?.startDate || '2025-02-10');
        const totalDays = Math.max(0, Math.floor((Date.now() - start.getTime()) / 86400000));
        const remainder = totalDays % 100;
        const next = remainder === 0 ? 100 : 100 - remainder;
        const element = document.getElementById('next-milestone-days');
        if (element) element.textContent = next;
    };

    const originalUpdateUI = window.updateUI;
    if (typeof originalUpdateUI === 'function') {
        window.updateUI = function (data) {
            originalUpdateUI(data);
            updateMilestone(data);
        };
    }

    updateMilestone(JSON.parse(localStorage.getItem('inLoveConfig') || 'null'));
}());
