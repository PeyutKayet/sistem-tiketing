import re

with open('app/pages/login.vue', 'r') as f:
    content = f.read()

pattern = r'''(const { data, error } = await supabase\.auth\.signUp\(\{\s*email: email\.value,\s*password: password\.value\s*\}\))'''
replacement = r"""const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
        phone: phone.value
      }
    }
  })"""

content = re.sub(pattern, replacement, content)

with open('app/pages/login.vue', 'w') as f:
    f.write(content)
