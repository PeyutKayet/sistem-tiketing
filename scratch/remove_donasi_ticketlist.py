import re

with open('app/components/event/TicketList.vue', 'r') as f:
    content = f.read()

# 1. Remove HTML
content = re.sub(r'<!-- Bagian Donasi -->.*?</div>\s*</div>\s*</template>', '</div>\n  </div>\n</template>', content, flags=re.DOTALL)

# 2. Remove script logic
content = re.sub(r',\s*donasiAmount:\s*\{\s*type:\s*Number,\s*default:\s*0\s*\}', '', content)
content = re.sub(r',\s*eventSettings:\s*\{\s*type:\s*Object,\s*default:\s*\(\)\s*=>\s*\(\{\}\)\s*\}', '', content)
content = content.replace(", 'update:donasiAmount'", '')
content = re.sub(r'const parsedDonasiOptions = computed.*?const formatPrice = \(price\) =>', 'const formatPrice = (price) =>', content, flags=re.DOTALL)

# 3. Remove CSS
content = re.sub(r'\.donasi-container \{.*?\.custom-input-field \{.*?\}', '', content, flags=re.DOTALL)

# Clean up empty lines
content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)

with open('app/components/event/TicketList.vue', 'w') as f:
    f.write(content)
