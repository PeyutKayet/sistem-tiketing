import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

# Add useImageCompress import
content = content.replace(
    "import { useCart } from '~/composables/useCart'",
    "import { useCart } from '~/composables/useCart'\nimport { useImageCompress } from '~/composables/useImageCompress'"
)

# Call useImageCompress
content = content.replace(
    "const currentStep = ref('home')",
    "const { compressImageFile } = useImageCompress()\n\nconst currentStep = ref('home')"
)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
