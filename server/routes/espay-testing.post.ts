import handler from '../api/webhook/espay-inquiry'

export default defineEventHandler(async (event) => {
  return handler(event)
})
