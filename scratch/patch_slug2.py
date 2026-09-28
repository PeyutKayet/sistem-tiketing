import re

with open('app/pages/[slug].vue', 'r') as f:
    content = f.read()

content = re.sub(r'const formatWaLink = \(noWa\) => \{[\s\S]*?\}\n', '', content)
content = re.sub(r'const updateKeranjang = \(tiketId, change, sisaKuota\) => \{[\s\S]*?\}\n', '', content)
content = re.sub(r'const copyNominal = async \(\) => \{[\s\S]*?\}\n', '', content)

with open('app/pages/[slug].vue', 'w') as f:
    f.write(content)
