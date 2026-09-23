import fs from 'fs';
const file = 'app/components/admin/AdminFormBuilder.vue';
let content = fs.readFileSync(file, 'utf8');

const oldRender = `    function renderGrid() {
        if(!gridContainer) return
        const containerRect = gridContainer.getBoundingClientRect()
        const cellW = containerRect.width / GRID_COLUMNS
        const cellH = cellW
        const maxRow = getMaxRow()

        gridContainer.style.minHeight = (maxRow * cellH + 20) + 'px'
        gridContainer.style.height = (maxRow * cellH + 20) + 'px'

        gridContainer.querySelectorAll('.ff-grid-item').forEach(el => el.remove())

        for (const item of items) {
            const div = document.createElement('div')
            div.className = 'ff-grid-item' + (item.id === selectedId ? ' selected' : '')
            div.dataset.id = item.id

            div.style.left = (item.x * cellW + 2) + 'px'
            div.style.top = (item.y * cellH + 2) + 'px'
            div.style.width = (item.width * cellW - 4) + 'px'
            div.style.height = (item.height * cellH - 4) + 'px'

            const labelDiv = document.createElement('div')
            labelDiv.className = 'ff-item-label'
            labelDiv.innerHTML = \`
                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                    <span style="color:#a5b4fc; margin-right:4px;">⋮⋮</span>
                    \${item.required ? '<span style="color:#d43f34;">*</span>' : ''} \${escapeHtml(item.label)}
                </span>
                <span class="ff-item-actions">
                    <button class="btn-icon duplicate-btn" title="Duplicate" style="background:none;border:none;cursor:pointer;color:#8a9aa8;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
                    <button class="btn-icon edit-btn" title="Edit Properties" style="background:none;border:none;cursor:pointer;color:#1a3a5c;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                    \${item.undeletable ? '' : '<button class="btn-icon danger delete-btn" title="Delete" style="background:none;border:none;cursor:pointer;color:#d43f34;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>'}
                </span>
            \`
            div.appendChild(labelDiv)

            const miniDiv = document.createElement('div')
            miniDiv.className = 'ff-mini-preview'
            miniDiv.innerHTML = \`<div class="ff-mini-input">\${item.type}</div>\` 
            div.appendChild(miniDiv)

            const badge = document.createElement('span')
            badge.className = 'ff-badge'
            badge.textContent = item.field_key || item.type
            div.appendChild(badge)

            const handle = document.createElement('div')
            handle.className = 'ff-resize-handle'
            div.appendChild(handle)

            div.addEventListener('mousedown', onItemMouseDown)
            div.addEventListener('click', onItemClick)

            labelDiv.querySelector('.duplicate-btn').addEventListener('click', (e) => { e.stopPropagation(); duplicateItem(item.id) })
            labelDiv.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); selectedId = item.id; renderGrid(); openPropertyModal() })
            if (!item.undeletable) {
                labelDiv.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteItem(item.id) })
            }
            handle.addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); startResize(item.id, e) })

            gridContainer.appendChild(div)
        }
        triggerUpdate()
    }`;

const newRender = `    function renderGrid() {
        if(!gridContainer) return
        const containerRect = gridContainer.getBoundingClientRect()
        const cellW = containerRect.width / GRID_COLUMNS
        const cellH = cellW
        const maxRow = getMaxRow()

        gridContainer.style.minHeight = (maxRow * cellH + 20) + 'px'
        gridContainer.style.height = (maxRow * cellH + 20) + 'px'

        const existingEls = Array.from(gridContainer.querySelectorAll('.ff-grid-item'))

        for (const item of items) {
            let div = gridContainer.querySelector(\`.ff-grid-item[data-id="\${item.id}"]\`)
            
            if (!div) {
                div = document.createElement('div')
                div.dataset.id = item.id
                gridContainer.appendChild(div)
                div.addEventListener('mousedown', onItemMouseDown)
                div.addEventListener('click', onItemClick)
            }
            
            div.className = 'ff-grid-item' + (item.id === selectedId ? ' selected' : '')
            div.style.left = (item.x * cellW + 2) + 'px'
            div.style.top = (item.y * cellH + 2) + 'px'
            div.style.width = (item.width * cellW - 4) + 'px'
            div.style.height = (item.height * cellH - 4) + 'px'

            div.innerHTML = \`
                <div class="ff-item-label">
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                        <span style="color:#a5b4fc; margin-right:4px;">⋮⋮</span>
                        \${item.required ? '<span style="color:#d43f34;">*</span>' : ''} \${escapeHtml(item.label)}
                    </span>
                    <span class="ff-item-actions">
                        <button class="btn-icon duplicate-btn" title="Duplicate" style="background:none;border:none;cursor:pointer;color:#8a9aa8;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
                        <button class="btn-icon edit-btn" title="Edit Properties" style="background:none;border:none;cursor:pointer;color:#1a3a5c;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                        \${item.undeletable ? '' : '<button class="btn-icon danger delete-btn" title="Delete" style="background:none;border:none;cursor:pointer;color:#d43f34;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>'}
                    </span>
                </div>
                <div class="ff-mini-preview"><div class="ff-mini-input">\${item.type}</div></div>
                <span class="ff-badge">\${item.field_key || item.type}</span>
                <div class="ff-resize-handle"></div>
            \`
            
            div.querySelector('.duplicate-btn').addEventListener('click', (e) => { e.stopPropagation(); duplicateItem(item.id) })
            div.querySelector('.edit-btn').addEventListener('click', (e) => { e.stopPropagation(); selectedId = item.id; renderGrid(); openPropertyModal() })
            if (!item.undeletable) {
                div.querySelector('.delete-btn').addEventListener('click', (e) => { e.stopPropagation(); deleteItem(item.id) })
            }
            div.querySelector('.ff-resize-handle').addEventListener('mousedown', (e) => { e.stopPropagation(); e.preventDefault(); startResize(item.id, e) })
        }

        existingEls.forEach(el => {
            if (!items.find(it => it.id === el.dataset.id)) el.remove()
        })
        triggerUpdate()
    }`;

if(content.includes(oldRender)) {
  content = content.replace(oldRender, newRender);
  fs.writeFileSync(file, content);
  console.log('patched successfully');
} else {
  console.log('could not find oldRender block in the file');
}
