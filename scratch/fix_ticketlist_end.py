with open('app/components/event/TicketList.vue', 'r') as f:
    content = f.read()

content = content.replace('    </div>\n    \n    </div>\n  </div>\n</template>', '    </div>\n  </div>\n</template>')

with open('app/components/event/TicketList.vue', 'w') as f:
    f.write(content)
