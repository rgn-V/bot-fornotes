import { add, addUser, notes, notesId, rm } from './supabase.js'
import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true })

const readLineList = {}

bot.setMyCommands([
  { command: '/start', description: 'Старт' },
  { command: '/notes', description: 'Все записи' },
  { command: '/add', description: 'Добавить' },
  { command: '/rm', description: 'Удалить' }
])

bot.on('message', async (msg) => {
  const { id: chatId, username } = msg.chat
  const readLine = readLineList[username]

  if (readLine?.action === 'add') {
    if (msg.text === '/add' || msg.text === '/notes' || msg.text === '/rm' || msg.text === '/start') {
      bot.sendMessage(chatId, 'Произошла ошибка')
      bot.sendMessage(chatId, 'Введите текст:')
      return
    } else {
      try {
        await add(username, msg.text)
        bot.sendMessage(chatId, 'Добавлено')
      } catch (error) {
        bot.sendMessage(chatId, 'Произошла ошибка')
      }
    }
    delete readLineList[username]
    return
  }

  if (readLine?.action === 'rm') {
    try {
      const { data } = await notesId(username)
      await rm(username, data[~~msg.text - 1].id)
      bot.sendMessage(chatId, 'Удалено')
    } catch (error) {
      console.log(error)
      bot.sendMessage(chatId, 'Произошла ошибка')
    }

    delete readLineList[username]
  }

  if (msg.text === '/start') {
    addUser(username)
  }

  if (msg.text === '/notes') {
    const { data } = await notes(username)
    bot.sendMessage(chatId, `Ваши заметки: \n${data.map(({ text }, index) => `${index + 1}. ${text}`).join('\n')}`)
  }

  if (msg.text === '/add') {
    readLineList[username] = {
      action: 'add',
    }

    bot.sendMessage(chatId, 'Введите текст:')
  }

  if (msg.text === '/rm') {
    readLineList[username] = {
      action: 'rm',
    }

    bot.sendMessage(chatId, 'Введите номер заметки')
  }
})







