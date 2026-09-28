import re

with open('app/pages/login.vue', 'r') as f:
    content = f.read()

lost_css = """
.login-card { position: relative; min-height: calc(100vh - 48px); background: #ffffff; border-radius: 34px; padding: 58px clamp(38px,6vw,92px) 34px; display: flex; flex-direction: column; justify-content: center; box-shadow: 0 18px 55px rgba(0,0,0,.05); overflow: hidden; border: 1px solid var(--line); z-index: 10; }
.logo { text-align: center; font-size: 38px; font-weight: 1000; letter-spacing: -2px; line-height: .8; margin-bottom: 42px; }
.logo .event { color: var(--text) } .logo .hub { color: #2563eb }
.logo small { display: block; width: max-content; margin: 12px auto 0; padding: 4px 13px; border-radius: 8px; background: #0f172a; color: #fff; font-size: 10px; letter-spacing: 5px; }

h1 { margin: 0; text-align: center; font-size: 30px; letter-spacing: -1px; color: #0f172a; }
.subtitle { text-align: center; color: var(--muted); margin: 10px auto 30px; max-width: 430px; line-height: 1.55; font-size: 14px; }

form { width: 100%; max-width: 500px; margin: auto; }
.field { position: relative; margin-bottom: 16px; }
.field input { width: 100%; height: 60px; border: 1.5px solid var(--line); border-radius: 12px; padding: 0 54px 0 54px; font-size: 15px; outline: none; background: #fff; transition: .2s; color: var(--text); }
.field input:focus { border-color: #2563eb; box-shadow: 0 0 0 4px rgba(37,99,235,.15); }
.icon { position: absolute; left: 20px; top: 18px; color: #9ba1ab; font-size: 21px; z-index: 2; }
.toggle { position: absolute; right: 18px; top: 18px; border: 0; background: none; font-size: 20px; color: #9299a5; cursor: pointer; }

.row { display: flex; justify-content: space-between; align-items: center; margin: 8px 2px 24px; font-size: 14px; color: #64748b; }
.remember { display: flex; gap: 9px; align-items: center; }
.remember input { width: 17px; height: 17px; accent-color: #2563eb; cursor: pointer; }
a { color: #2563eb; text-decoration: none; font-weight: 600; }

.btn { width: 100%; height: 58px; border: 0; border-radius: 12px; background: #0f172a; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; box-shadow: 0 8px 20px rgba(15, 23, 42,.15); transition: .2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
.btn:hover { transform: translateY(-2px); background: #1e293b; }
.btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.divider { display: flex; align-items: center; gap: 15px; margin: 24px 0; color: #94a3b8; font-size: 13px; }
.divider:before, .divider:after { content: ""; height: 1px; background: #e2e8f0; flex: 1; }

.signup { width: 100%; height: 54px; border: 1.5px solid #e2e8f0; border-radius: 12px; background: #fff; color: #334155; font-size: 15px; font-weight: 700; cursor: pointer; transition: .2s; display: flex; justify-content: center; align-items: center; gap: 10px; }
.signup:hover { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
.signup:disabled { opacity: 0.7; cursor: not-allowed; }

#msg { text-align: center; font-size: 13px; font-weight: 600; margin-top: 16px; min-height: 20px; }
.footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 28px; }
"""

content = content.replace('@media(max-width: 1050px)', lost_css + '\n@media(max-width: 1050px)')

with open('app/pages/login.vue', 'w') as f:
    f.write(content)
