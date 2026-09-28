import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# Replace the pink/red CSS with a neutral, matching CSS
old_css = """.donasi-container {
  margin-top: 15px;
  background: #fff0f2;
  border: 1px solid #fecdd3;
  border-radius: 12px;
  padding: 12px;
}
.donasi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e11d48;
  margin-bottom: 10px;
}
.donasi-icon {
  width: 18px;
  height: 18px;
}
.donasi-title {
  font-size: 0.85rem;
  font-weight: 800;
}
.donasi-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.donasi-btn {
  background: white;
  border: 1px solid #fecdd3;
  color: #e11d48;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.donasi-btn.active {
  background: #e11d48;
  color: white;
  border-color: #e11d48;
}
.donasi-custom-input {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #fecdd3;
  border-radius: 8px;
  overflow: hidden;
}
.currency-label {
  background: #fff0f2;
  color: #e11d48;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-right: 1px solid #fecdd3;
}
.custom-input-field {
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  color: var(--text-main);
}
.donasi-off {
  background: #f8fafc !important;
  border-color: #e2e8f0 !important;
  opacity: 0.7;
}
.donasi-off .donasi-header-title {
  color: #64748b;
}
.donasi-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.donasi-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e11d48;
  transition: 0.3s;
}
.donasi-body {
  margin-top: 12px;
  border-top: 1px dashed #fecdd3;
  padding-top: 12px;
}

/* CSS untuk Switch Toggle ala iOS */
.donasi-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.donasi-toggle input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.donasi-toggle .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.donasi-toggle .slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}
.donasi-toggle input:checked + .slider {
  background-color: #e11d48;
}
.donasi-toggle input:checked + .slider:before {
  transform: translateX(20px);
}
.donasi-toggle .slider.round {
  border-radius: 24px;
}
.donasi-toggle .slider.round:before {
  border-radius: 50%;
}"""

new_css = """.donasi-container {
  margin-top: 15px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  margin-bottom: 15px;
}
.donasi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  margin-bottom: 10px;
}
.donasi-icon {
  width: 18px;
  height: 18px;
  color: var(--primary);
}
.donasi-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main);
}
.donasi-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.donasi-btn {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.donasi-btn.active {
  background: #eff6ff;
  color: var(--primary);
  border-color: var(--primary);
}
.donasi-custom-input {
  margin-top: 10px;
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
}
.currency-label {
  background: #e2e8f0;
  color: #475569;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-right: 1px solid #cbd5e1;
}
.custom-input-field {
  flex: 1;
  border: none;
  padding: 8px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  background: transparent;
  color: var(--text-main);
}
.donasi-off {
  background: #f8fafc !important;
  opacity: 0.6;
}
.donasi-off .donasi-header-title {
  color: #94a3b8;
}
.donasi-off .donasi-icon {
  color: #94a3b8;
}
.donasi-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.donasi-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
}
.donasi-body {
  margin-top: 15px;
  border-top: 1px dashed #e2e8f0;
  padding-top: 15px;
}

/* CSS untuk Switch Toggle ala iOS */
.donasi-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.donasi-toggle input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.donasi-toggle .slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .3s;
}
.donasi-toggle .slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
}
.donasi-toggle input:checked + .slider {
  background-color: var(--primary);
}
.donasi-toggle input:checked + .slider:before {
  transform: translateX(20px);
}
.donasi-toggle .slider.round {
  border-radius: 24px;
}
.donasi-toggle .slider.round:before {
  border-radius: 50%;
}"""

content = content.replace(old_css, new_css)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
