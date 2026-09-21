<template>
  <div ref="builderWrapper" class="ff-shared-builder-ui" style="display:flex; flex-direction:column; gap:16px;">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4 style="margin-bottom:4px;font-weight:600;color:#0a1929;">📋 Form Builder</h4>
        <p style="font-size:13px;color:#8a9aa8;margin:0;">Tarik elemen ke kanvas untuk membangun form.</p>
      </div>
      <div class="ff-add-element-bar" style="display:flex; gap:8px;">
        <button class="btn-outline btn-sm" @click="resetGrid" style="font-size:12px; padding:6px 12px; font-weight:600;">🔄 Reset</button>
        <button class="btn-outline danger btn-sm" @click="clearCanvas" style="font-size:12px; padding:6px 12px; font-weight:600;">🗑️ Kosongkan</button>
      </div>
    </div>

    <!-- Panel Komponen Field -->
    <div class="ff-field-types-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; background: #ffffff; padding: 10px; border-radius: 12px; border: 1px solid #e6edf5; box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);">
      <button class="ff-field-type-btn btn-outline" data-type="short_text" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:text-cursor-input" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Short Text</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="paragraph" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:align-left" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Paragraph</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="multiple_choice" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:circle-dot" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">M. Choice</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="checkboxes" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:check-square" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Checkboxes</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="dropdown" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:chevron-down-square" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Dropdown</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="linear_scale" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:sliders-horizontal" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Lin. Scale</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="date" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:calendar" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Date</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="time" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:clock" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Time</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="file_upload" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:paperclip" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Upload</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="terms" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:file-signature" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Terms</span></button>
      
      <button class="ff-field-type-btn btn-outline" data-type="domisili_api" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px; border-color: #3b82f6; background: #eff6ff;"><Icon name="lucide:map-pin" style="font-size:16px; color:#1d4ed8;" /> <span style="font-size:9px; font-weight:700; color: #1d4ed8;">Domisili</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="phone_wa" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px; border-color: #22c55e; background: #f0fdf4;"><Icon name="lucide:phone" style="font-size:16px; color:#15803d;" /> <span style="font-size:9px; font-weight:700; color: #15803d;">No. WA</span></button>
      <button class="ff-field-type-btn btn-outline" data-type="currency_rp" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px; border-color: #eab308; background: #fefce8;"><Icon name="lucide:banknote" style="font-size:16px; color:#a16207;" /> <span style="font-size:9px; font-weight:700; color: #a16207;">Rupiah</span></button>
      
      <button class="ff-field-type-btn btn-outline" data-type="header" style="display:flex; flex-direction:column; align-items:center; gap:4px; padding:6px; border-radius:8px;"><Icon name="lucide:heading" style="font-size:16px;" /> <span style="font-size:9px; font-weight:600;">Header</span></button>
    </div>

    <!-- Kanvas Drag & Drop -->
    <div class="ff-canvas-wrapper" style="background: #fafcfe; border-radius: 16px; border: 2px dashed #c8d6e8; padding: 20px; flex: 1; min-height: 250px; position: relative; overflow: auto; background-image: radial-gradient(circle, #e6edf5 1px, transparent 1px); background-size: 20px 20px; transition: 0.2s;">
      <div class="ff-grid-container" style="position: relative; width: 100%; min-height: 400px; transition: min-height 0.2s ease;">
        <div class="ff-drop-preview" style="position: absolute; border: 2px dashed var(--primary); border-radius: 12px; background: var(--primary-shadow); pointer-events: none; z-index: 50; opacity: 0; visibility: hidden; transition: 0.15s;"></div>
      </div>
    </div>
    
    <div style="font-size:11px; font-weight:500; color:#8a9aa8; display:flex; gap:16px; justify-content:center;">
      <span>🤚 Drag to move</span>
      <span>📐 Resize from corner</span>
      <span>✏️ Click to edit</span>
    </div>

    <!-- ===== FORM BUILDER PROPERTY MODAL ===== -->
    <div class="wizard-overlay ff-property-overlay" style="z-index: 10001;">
      <div class="wizard" style="max-width:540px;padding:28px 32px;height:auto;">
        <button class="close ff-close-prop">✖</button>
        <h3 style="margin-bottom:16px;font-weight:600;color:#0a1929;">✏️ Edit Form Field</h3>
        <div class="ff-property-content">
          <!-- Konten dinamis properties akan di-render di sini -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

const { formForgeItems, showConfirm, showToast } = useAdmin()

const builderWrapper = ref(null)

const FIELD_LABELS = {
  short_text: 'Short Text', paragraph: 'Paragraph', multiple_choice: 'Multiple Choice',
  checkboxes: 'Checkboxes', dropdown: 'Dropdown', linear_scale: 'Linear Scale',
  date: 'Date', time: 'Time', file_upload: 'File Upload', terms: 'Terms',
  multiple_choice_grid: 'MC Grid', checkbox_grid: 'CB Grid', header: 'Header',
  domisili_api: 'Domisili (Auto)', phone_wa: 'No. WA (Auto)', currency_rp: 'Rupiah (Rp)'
};

function getDefaultItems() {
  return [
      { id: 'ff_default_nama', type: 'short_text', label: 'Nama Lengkap', field_key: 'nama_lengkap', x: 0, y: 0, width: 12, height: 2, required: true, undeletable: true },
      { id: 'ff_default_email', type: 'short_text', label: 'Email', field_key: 'email', x: 0, y: 2, width: 6, height: 2, required: true, undeletable: true },
      { id: 'ff_default_wa', type: 'phone_wa', label: 'No. WhatsApp', field_key: 'no_wa', x: 6, y: 2, width: 6, height: 2, required: true, undeletable: true }
  ];
}

const resetGrid = () => {
  formForgeItems.value = getDefaultItems()
  if (window._ffInstance) window._ffInstance.init(formForgeItems.value)
}

const clearCanvas = () => {
  showConfirm('Kosongkan Kanvas', 'Semua form field tambahan akan dihapus. Field bawaan sistem (Nama, Email, WA) akan tetap dipertahankan. Lanjutkan?', 'Ya, Hapus', 'danger', () => {
      formForgeItems.value = formForgeItems.value.filter(it => it.undeletable)
      if (window._ffInstance) window._ffInstance.init(formForgeItems.value)
  })
}

// ==========================================
// VANILLA JS FORMFORGE ADAPTER
// ==========================================
onMounted(() => {
  nextTick(() => {
    if (!builderWrapper.value) return

    const GRID_COLUMNS = 12
    const MIN_ITEM_WIDTH = 1
    const MAX_ITEM_WIDTH = 12
    const MIN_ITEM_HEIGHT = 1
    const MAX_ITEM_HEIGHT = 6
    const MIN_ROWS = 10

    let items = []
    let nextId = Date.now()
    let selectedId = null

    const gridContainer = builderWrapper.value.querySelector('.ff-grid-container')
    const dropPreview = builderWrapper.value.querySelector('.ff-drop-preview')
    const propertyOverlay = builderWrapper.value.querySelector('.ff-property-overlay')
    const propertyContent = builderWrapper.value.querySelector('.ff-property-content')
    const closePropBtn = builderWrapper.value.querySelector('.ff-close-prop')

    closePropBtn.addEventListener('click', () => { propertyOverlay.classList.remove('open') })

    function generateId() { return 'ff_item_' + (nextId++) }
    function getRect(item) { return { x: item.x, y: item.y, w: item.width, h: item.height } }
    function rectsOverlap(a, b) { return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y }
    function getMaxRow() {
        let maxY = 0
        for (const item of items) maxY = Math.max(maxY, item.y + item.height)
        return Math.max(maxY, MIN_ROWS)
    }
    function getSelectedItem() { return items.find(it => it.id === selectedId) || null }
    function slugify(text) { return text ? text.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') : 'field' }
    function escapeHtml(text) { 
        if (!text) return ''
        const div = document.createElement('div'); div.textContent = text; return div.innerHTML 
    }

    const triggerUpdate = () => {
      formForgeItems.value = JSON.parse(JSON.stringify(items))
      // Trigger a custom event to notify external components (like AdminWizard) to render the preview
      window.dispatchEvent(new CustomEvent('ff-updated'))
    }

    function renderGrid() {
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
            labelDiv.innerHTML = `
                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                    <span style="color:#a5b4fc; margin-right:4px;">⋮⋮</span>
                    ${item.required ? '<span style="color:#d43f34;">*</span>' : ''} ${escapeHtml(item.label)}
                </span>
                <span class="ff-item-actions">
                    <button class="btn-icon duplicate-btn" title="Duplicate" style="background:none;border:none;cursor:pointer;color:#8a9aa8;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>
                    <button class="btn-icon edit-btn" title="Edit Properties" style="background:none;border:none;cursor:pointer;color:#1a3a5c;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg></button>
                    ${item.undeletable ? '' : '<button class="btn-icon danger delete-btn" title="Delete" style="background:none;border:none;cursor:pointer;color:#d43f34;"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button>'}
                </span>
            `
            div.appendChild(labelDiv)

            const miniDiv = document.createElement('div')
            miniDiv.className = 'ff-mini-preview'
            miniDiv.innerHTML = `<div class="ff-mini-input">${item.type}</div>` 
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
    }

    function addItem(type, x, y) {
        let w = (['multiple_choice_grid', 'checkbox_grid', 'paragraph', 'terms', 'header'].includes(type)) ? 12 : 6
        const item = { id: generateId(), type: type, label: FIELD_LABELS[type] || 'Field', field_key: slugify(FIELD_LABELS[type]), x: x||0, y: y||0, width: w, height: 2, required: false }
        items.push(item); selectedId = item.id
        renderGrid(); openPropertyModal()
    }
    function deleteItem(id) { 
        const item = items.find(it => it.id === id); if (item && item.undeletable) return
        items = items.filter(it => it.id !== id) 
        if(selectedId===id) { selectedId=null; propertyOverlay.classList.remove('open') } 
        renderGrid() 
    }
    function duplicateItem(id) {
        const src = items.find(it => it.id === id); if(!src) return
        const newItem = JSON.parse(JSON.stringify(src))
        newItem.id = generateId(); newItem.field_key = slugify(newItem.label + '_' + newItem.id)
        newItem.y = src.y + src.height
        items.push(newItem); selectedId = newItem.id
        recalcWaterfall(); renderGrid(); openPropertyModal()
    }
    function updateItem(id, updates) {
        const item = items.find(it => it.id === id); if(!item) return
        Object.assign(item, updates); renderGrid()
    }

    function openPropertyModal() {
        propertyOverlay.classList.add('open')
        const item = getSelectedItem()
        if(!item) { propertyContent.innerHTML = '<div style="color:#8a9aa8; text-align:center;">Pilih field dulu</div>'; return }
        
        let html = `
            <div class="ff-property-group">
                <label>${item.type === 'header' ? 'Teks Header' : 'Label / Pertanyaan'}</label>
                <input type="text" id="ffPropLabel" value="${escapeHtml(item.label)}" class="form-control" />
            </div>`

        if (item.type !== 'header') {
            html += `
            <div class="ff-property-group">
                <label>Field Key (ID Database)</label>
                <input type="text" id="ffPropKey" value="${escapeHtml(item.field_key)}" class="form-control" />
            </div>
            <div class="ff-property-group">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-weight:500; font-size:14px; text-transform:none; color:#0a1929;">
                    <input type="checkbox" id="ffPropReq" ${item.required ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--primary);" /> Wajib diisi (Required)
                </label>
            </div>`
        }

        if (['multiple_choice', 'checkboxes', 'dropdown'].includes(item.type)) {
            const opts = item.options || ['Opsi 1', 'Opsi 2']; item.options = opts
            html += `
            <div class="ff-property-group" style="margin-top:8px;">
                <label>Pilihan Opsi</label>
                <div id="ffOptionsList" style="display:flex; flex-direction:column; gap:6px;">`
            opts.forEach((opt, idx) => {
                html += `
                    <div style="display:flex; gap:6px; align-items:center;">
                        <input type="text" value="${escapeHtml(opt)}" class="form-control ff-opt-input" data-index="${idx}" style="padding:6px 10px; font-size:12px;" />
                        <button class="btn-icon danger ff-opt-del" data-index="${idx}" style="font-size:14px; padding:4px 8px;">🗑️</button>
                    </div>`
            })
            html += `
                </div>
                <button class="btn-outline btn-sm" id="ffOptAdd" style="align-self:flex-start; margin-top:4px;">+ Tambah Opsi</button>
            </div>`
        } else if (item.type === 'linear_scale') {
            item.scaleCount = item.scaleCount || 5
            html += `
            <div class="ff-property-group" style="margin-top:8px;">
                <label>Jumlah Skala (Max)</label>
                <select id="ffPropScale" class="form-control" style="padding:6px 10px; font-size:12px;">
                    ${[3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${item.scaleCount === n ? 'selected' : ''}>${n}</option>`).join('')}
                </select>
            </div>`
        } else if (item.type === 'terms') {
            item.termsText = item.termsText || 'Saya menyetujui semua syarat dan ketentuan yang berlaku.'
            html += `
            <div class="ff-property-group" style="margin-top:8px;">
                <label>Teks Syarat & Ketentuan</label>
                <textarea id="ffPropTermsText" class="form-control" rows="4" style="font-size:12px; resize:vertical;">${escapeHtml(item.termsText)}</textarea>
            </div>`
        }

        html += `
            ${item.undeletable ? '<div style="font-size:11px; color:#8a9aa8; text-align:center; margin-top:10px;">🔒 Field bawaan sistem tidak bisa dihapus.</div>' : '<button class="btn-outline danger" id="ffBtnDelete" style="width:100%; margin-top:10px;">🗑️ Hapus Field Ini</button>'}
        `

        propertyContent.innerHTML = html

        propertyContent.querySelector('#ffPropLabel').addEventListener('input', function() {
            const newKey = item.field_key === slugify(item.label) ? slugify(this.value) : item.field_key
            updateItem(item.id, { label: this.value, field_key: newKey })
            const keyInput = propertyContent.querySelector('#ffPropKey')
            if (keyInput && item.field_key === slugify(item.label)) keyInput.value = newKey
        })
        const reqInput = propertyContent.querySelector('#ffPropReq')
        if (reqInput) reqInput.addEventListener('change', function() { updateItem(item.id, { required: this.checked }) })
        
        if (['multiple_choice', 'checkboxes', 'dropdown'].includes(item.type)) {
            propertyContent.querySelectorAll('.ff-opt-input').forEach(input => {
                input.addEventListener('input', function() { item.options[this.dataset.index] = this.value; renderGrid() })
            })
            propertyContent.querySelectorAll('.ff-opt-del').forEach(btn => {
                btn.addEventListener('click', function() {
                    if(item.options.length > 1) { item.options.splice(this.dataset.index, 1); renderGrid(); openPropertyModal() }
                })
            })
            propertyContent.querySelector('#ffOptAdd').addEventListener('click', function() {
                item.options.push('Opsi ' + (item.options.length + 1)); renderGrid(); openPropertyModal()
            })
        }

        const delBtn = propertyContent.querySelector('#ffBtnDelete')
        if (delBtn) delBtn.addEventListener('click', function() { deleteItem(item.id) })
    }

    function recalcWaterfall() {
        items.sort((a, b) => a.y - b.y || a.x - b.x)
        let needsRecheck = true
        while(needsRecheck) {
            needsRecheck = false
            for(let i=0; i<items.length; i++) {
                for(let j=0; j<i; j++) {
                    if(rectsOverlap(getRect(items[i]), getRect(items[j]))) {
                        items[i].y = items[j].y + items[j].height
                        needsRecheck = true
                    }
                }
            }
            if(needsRecheck) items.sort((a, b) => a.y - b.y || a.x - b.x)
        }
    }

    let dragState = null
    function onItemMouseDown(e) {
        const itemEl = e.target.closest('.ff-grid-item')
        if (!itemEl || e.target.closest('button') || e.target.closest('.ff-resize-handle')) return
        e.preventDefault()
        const item = items.find(it => it.id === itemEl.dataset.id)
        if (!item) return
        
        const rect = gridContainer.getBoundingClientRect()
        const cellW = rect.width / GRID_COLUMNS
        dragState = {
            id: item.id, startX: item.x, startY: item.y,
            offX: (e.clientX - (item.x * cellW + rect.left)) / cellW,
            offY: (e.clientY - (item.y * cellW + rect.top)) / cellW,
            dragging: false
        }
        document.addEventListener('mousemove', onDragMove)
        document.addEventListener('mouseup', onDragEnd)
    }
    function onDragMove(e) {
        if (!dragState) return
        const rect = gridContainer.getBoundingClientRect()
        const cellW = rect.width / GRID_COLUMNS
        const col = Math.round((e.clientX - rect.left - dragState.offX * cellW) / cellW)
        const row = Math.round((e.clientY - rect.top - dragState.offY * cellW) / cellW)
        
        const item = items.find(it => it.id === dragState.id)
        item._dragX = Math.max(0, Math.min(col, GRID_COLUMNS - item.width))
        item._dragY = Math.max(0, row)

        if(!dragState.dragging) {
            dragState.dragging = true
            gridContainer.querySelector(`[data-id="${item.id}"]`).classList.add('dragging')
        }
        
        dropPreview.style.left = (item._dragX * cellW + 2) + 'px'
        dropPreview.style.top = (item._dragY * cellW + 2) + 'px'
        dropPreview.style.width = (item.width * cellW - 4) + 'px'
        dropPreview.style.height = (item.height * cellW - 4) + 'px'
        dropPreview.style.visibility = 'visible'; dropPreview.style.opacity = '1'

        const el = gridContainer.querySelector(`[data-id="${item.id}"]`)
        if(el) {
            el.style.left = (item._dragX * cellW + 2) + 'px'
            el.style.top = (item._dragY * cellW + 2) + 'px'
        }
    }
    function onDragEnd(e) {
        if (!dragState) return
        const item = items.find(it => it.id === dragState.id)
        if (item) {
            item.x = item._dragX !== undefined ? item._dragX : item.x
            item.y = item._dragY !== undefined ? item._dragY : item.y
            delete item._dragX; delete item._dragY
            recalcWaterfall()
        }
        dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0'
        dragState = null
        document.removeEventListener('mousemove', onDragMove); document.removeEventListener('mouseup', onDragEnd)
        renderGrid()
    }

    let resizeState = null
    function startResize(id, e) {
        const item = items.find(it => it.id === id); if(!item) return
        const rect = gridContainer.getBoundingClientRect()
        resizeState = { id, startX: e.clientX, startY: e.clientY, startW: item.width, startH: item.height, cellW: rect.width / GRID_COLUMNS }
        document.addEventListener('mousemove', onResizeMove); document.addEventListener('mouseup', onResizeEnd)
    }
    function onResizeMove(e) {
        if (!resizeState) return
        const dx = (e.clientX - resizeState.startX) / resizeState.cellW
        const dy = (e.clientY - resizeState.startY) / resizeState.cellW
        const item = items.find(it => it.id === resizeState.id)
        let newW = Math.max(MIN_ITEM_WIDTH, Math.min(MAX_ITEM_WIDTH, Math.round(resizeState.startW + dx)))
        let newH = Math.max(MIN_ITEM_HEIGHT, Math.min(MAX_ITEM_HEIGHT, Math.round(resizeState.startH + dy)))
        
        item._resW = newW; item._resH = newH
        
        dropPreview.style.left = (item.x * resizeState.cellW + 2) + 'px'
        dropPreview.style.top = (item.y * resizeState.cellW + 2) + 'px'
        dropPreview.style.width = (newW * resizeState.cellW - 4) + 'px'
        dropPreview.style.height = (newH * resizeState.cellW - 4) + 'px'
        dropPreview.style.visibility = 'visible'; dropPreview.style.opacity = '1'
    }
    function onResizeEnd(e) {
        if (!resizeState) return
        const item = items.find(it => it.id === resizeState.id)
        if (item) {
            item.width = item._resW !== undefined ? item._resW : item.width
            item.height = item._resH !== undefined ? item._resH : item.height
            delete item._resW; delete item._resH
            recalcWaterfall()
        }
        dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0'
        resizeState = null
        document.removeEventListener('mousemove', onResizeMove); document.removeEventListener('mouseup', onResizeEnd)
        renderGrid()
    }

    let sideDrag = null
    builderWrapper.value.querySelectorAll('.ff-field-type-btn').forEach(btn => {
        btn.addEventListener('mousedown', e => {
            const type = btn.dataset.type
            const clone = document.createElement('div')
            clone.className = 'ff-sidebar-drag-clone'
            clone.textContent = FIELD_LABELS[type] || type
            clone.style.left = e.clientX + 'px'; clone.style.top = e.clientY + 'px'
            document.body.appendChild(clone)
            sideDrag = { type, clone, dragging: false }
            document.addEventListener('mousemove', onSideMove); document.addEventListener('mouseup', onSideEnd)
            e.preventDefault()
        })
    })
    function onSideMove(e) {
        if(!sideDrag) return
        sideDrag.clone.style.left = e.clientX + 'px'; sideDrag.clone.style.top = e.clientY + 'px'
        
        const rect = gridContainer.getBoundingClientRect()
        const isOver = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        if(isOver) {
            const cellW = rect.width / GRID_COLUMNS
            const col = Math.max(0, Math.min(GRID_COLUMNS - 6, Math.round((e.clientX - rect.left) / cellW)))
            const row = Math.max(0, Math.round((e.clientY - rect.top) / cellW))
            
            dropPreview.style.left = (col * cellW + 2) + 'px'
            dropPreview.style.top = (row * cellW + 2) + 'px'
            dropPreview.style.width = (6 * cellW - 4) + 'px'
            dropPreview.style.height = (2 * cellW - 4) + 'px'
            dropPreview.style.visibility = 'visible'; dropPreview.style.opacity = '1'
        } else {
            dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0'
        }
    }
    function onSideEnd(e) {
        if(!sideDrag) return
        const rect = gridContainer.getBoundingClientRect()
        const isOver = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom
        if(isOver) {
            const cellW = rect.width / GRID_COLUMNS
            const col = Math.max(0, Math.min(GRID_COLUMNS - 6, Math.round((e.clientX - rect.left) / cellW)))
            const row = Math.max(0, Math.round((e.clientY - rect.top) / cellW))
            addItem(sideDrag.type, col, row)
        }
        sideDrag.clone.remove()
        dropPreview.style.visibility = 'hidden'; dropPreview.style.opacity = '0'
        document.removeEventListener('mousemove', onSideMove); document.removeEventListener('mouseup', onSideEnd)
        sideDrag = null
    }

    function onItemClick(e) {
        const itemEl = e.target.closest('.ff-grid-item')
        if (!itemEl || e.target.closest('button') || e.target.closest('.ff-resize-handle')) return
        selectedId = itemEl.dataset.id
        renderGrid(); openPropertyModal()
    }

    const ro = new ResizeObserver(() => { renderGrid() })
    ro.observe(gridContainer)

    window._ffInstance = {
      init: (initItems) => {
        if (!initItems || initItems.length === 0) {
            items = getDefaultItems()
        } else {
            const hasDefaults = initItems.some(it => it.undeletable)
            items = hasDefaults ? initItems : [...getDefaultItems(), ...initItems]
        }
        recalcWaterfall(); renderGrid()
      }
    }

    window._ffInstance.init(formForgeItems.value)
  })
})
</script>

<style>
.ff-grid-item { position: absolute; background: #ffffff; border-radius: 12px; padding: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.03); border: 1px solid #e6edf5; transition: all 0.15s ease; cursor: grab; display: flex; flex-direction: column; gap: 6px; overflow: hidden; min-height: 50px; min-width: 30px; user-select: none; animation: itemAppear 0.3s ease-out; }
@keyframes itemAppear { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
.ff-grid-item:hover { border-color: #c8d6e8; box-shadow: 0 8px 20px -8px rgba(26,58,92,0.15); transform: translateY(-1px); }
.ff-grid-item.selected { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-shadow); }
.ff-grid-item.dragging { opacity: 0.8; z-index: 100; cursor: grabbing; transform: scale(1.03); box-shadow: 0 12px 30px -10px rgba(0,0,0,0.2); }
.ff-item-label { font-size: 12px; font-weight: 600; color: #0a1929; display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.ff-item-actions { display: flex; align-items: center; gap: 2px; opacity: 0; transition: 0.15s; }
.ff-grid-item:hover .ff-item-actions { opacity: 1; }
.ff-resize-handle { position: absolute; bottom: 4px; right: 4px; width: 20px; height: 20px; cursor: nwse-resize; opacity: 0; background: linear-gradient(135deg, transparent 50%, #8a9aa8 50%); border-radius: 0 0 10px 0; }
.ff-grid-item:hover .ff-resize-handle, .ff-grid-item.selected .ff-resize-handle { opacity: 0.8; }
.ff-resize-handle:hover { opacity: 1; background: linear-gradient(135deg, transparent 50%, var(--primary) 50%); }
.ff-sidebar-drag-clone { position: fixed; pointer-events: none; z-index: 10000; background: #ffffff; border: 2px solid var(--primary); border-radius: 12px; padding: 10px 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); font-size: 12px; font-weight: 600; color: #0a1929; opacity: 0.9; transform: translate(-50%, -50%); }
.ff-mini-preview { flex: 1; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
.ff-mini-input { background: #f0f4fa; border: 1px solid #e6edf5; border-radius: 8px; padding: 6px 10px; font-size: 10px; color: #8a9aa8; width: 100%; min-height: 24px; }
.ff-badge { font-size: 9px; color: #8a9aa8; background: #f0f4fa; padding: 2px 8px; border-radius: 20px; display: inline-block; width: fit-content; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.ff-property-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.ff-property-group label { font-size: 12px; font-weight: 600; color: #4a5a6e; text-transform: uppercase; letter-spacing: 0.3px; }
</style>
