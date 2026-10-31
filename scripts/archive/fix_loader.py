import re

file = 'app/pages/[slug].vue'
with open(file, 'r') as f:
    content = f.read()

# Replace document.querySelector('.api-loader')?.classList.add('active') with isSubmitting.value = true in lanjutBayar
content = content.replace("    document.querySelector('.api-loader')?.classList.add('active')", "    isSubmitting.value = true", 1)

# Remove the remove('active') in catch block
content = content.replace("    } catch (err) {\n      document.querySelector('.api-loader')?.classList.remove('active')", "    } catch (err) {\n      isSubmitting.value = false", 1)

# Remove the remove('active') after catch block
content = content.replace("    }\n    document.querySelector('.api-loader')?.classList.remove('active')", "    }\n    isSubmitting.value = false", 1)


with open(file, 'w') as f:
    f.write(content)
