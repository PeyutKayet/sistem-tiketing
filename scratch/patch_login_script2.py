import re

with open('app/pages/login.vue', 'r') as f:
    content = f.read()

# 1. Add refs to script
content = re.sub(
    r'(const email = ref\(\'\'\))',
    r"const isRegister = ref(false)\nconst fullName = ref('')\nconst phone = ref('')\n\n\1",
    content
)

# 2. Update prosesRegister function
old_register_func = """const prosesRegister = async () => {
  isLoadingBtn.value = 'register'
  msg.value = ''
  
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })"""

new_register_func = """const prosesRegister = async () => {
  isLoadingBtn.value = 'register'
  msg.value = ''
  
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        full_name: fullName.value,
        phone: phone.value
      }
    }
  })"""
content = content.replace(old_register_func, new_register_func)

with open('app/pages/login.vue', 'w') as f:
    f.write(content)
