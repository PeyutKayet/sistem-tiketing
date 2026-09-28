import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# Strip all old donasi CSS by finding the block and replacing it
# The old CSS uses .donasi-container, .donasi-off, .donasi-toggle, .donasi-btn, etc.
# I'll just use regex to remove anything related to donasi in the style block.
content = re.sub(r'\.donasi-[^{]+\{[^}]+\}', '', content)
content = re.sub(r'\.currency-label[^}]+\}', '', content)
content = re.sub(r'\.custom-input-field[^}]+\}', '', content)

# Now add the correct new minimal CSS before </style>
css_new = """.donasi-minimal-container {
  margin: 15px 0 25px;
  padding: 0 5px;
}
.donasi-minimal-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.donasi-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
  cursor: pointer;
}
.donasi-minimal-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}
.donasi-minimal-body {
  margin-top: 12px;
  padding-left: 28px;
}
.donasi-options-small {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.donasi-btn-small {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.donasi-btn-small.active {
  background: #eff6ff;
  color: var(--primary);
  border-color: var(--primary);
}
.donasi-input-small {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  max-width: 250px;
}
.currency-label-small {
  background: #f8fafc;
  color: #475569;
  font-weight: 700;
  font-size: 0.8rem;
  padding: 8px 12px;
  border-right: 1px solid #cbd5e1;
}
.custom-input-field-small {
  flex: 1;
  border: none;
  padding: 8px 10px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  background: transparent;
  color: var(--text-main);
}
"""

content = content.replace('</style>', css_new + '\n</style>')

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
