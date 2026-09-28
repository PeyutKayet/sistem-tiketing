import re

with open('app/pages/login.vue', 'r') as f:
    content = f.read()

old_script_start = """const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const msg = ref('')
const msgColor = ref('#ef4444')
const isLoadingBtn = ref(null)
const isLookingAway = ref(false)"""

new_script_start = """const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const isRegister = ref(false)
const fullName = ref('')
const phone = ref('')

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const msg = ref('')
const msgColor = ref('#ef4444')
const isLoadingBtn = ref(null)"""
content = content.replace(old_script_start, new_script_start)

old_register_func = """const prosesRegister = async () => {
  isLoadingBtn.value = 'register'
  msg.value = ''
  
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
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
