import inquiryHandler from '~~/server/api/webhook/espay-inquiry'

export default defineEventHandler(async (event) => {
  return inquiryHandler(event)
})
