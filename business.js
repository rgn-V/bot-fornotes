import { add, addUser, notes, notesId, rm } from './supabase.js'

/**
 * @typedef {"add" | "rm"} Actions
 */

/**
 * @typedef {{[username: string]: {action: Actions}}} ReadLineList
 */

/**
 * @typedef {(import('node-telegram-bot-api').BotCommand & {
 *  handler: (props: {chatId: number, username: string, bot: TelegramBot, readLineList: ReadLineList}) => Promise<void>
 * })} Command
 */

/**
 * @typedef {{[action in Actions]: (props: {chatId: number, bot: import('node-telegram-bot-api'), payload: string, username: string}) => Promise<void>}} ActionsHandlerList
 */

/**@type { Command[] } */
const commands = [
  { command: '/start', description: 'Старт', handler: ({ username }) => addUser(username) },
  {
    command: '/notes',
    description: 'Все записи',
    handler: async ({ username, bot, chatId }) => {
      const { data } = await notes(username)
      bot.sendMessage(chatId, `Ваши заметки: \n${data.map(({ text }, index) => `${index + 1}. ${text}`).join('\n')}`)
    },
  },
  {
    command: '/add',
    description: 'Добавить',
    handler: ({ username, chatId, readLineList }) => {
      if (!username) {
        return
      }

      readLineList[username] = {
        action: 'add',
      }

      bot.sendMessage(chatId, 'Введите текст:')
    },
  },
  {
    command: '/rm',
    description: 'Удалить',
    handler: ({ username, chatId, readLineList }) => {
      if (!username) {
        return
      }

      readLineList[username] = {
        action: 'rm',
      }

      bot.sendMessage(chatId, 'Введите номер заметки')
    },
  },
]

/** @type { ActionsHandlerList } */
const actionsHandler = {
  add: async ({ bot, chatId, payload, username }) => {
    try {
      await add(username, payload)
      bot.sendMessage(chatId, 'Добавлено')
    } catch (error) {
      bot.sendMessage(chatId, 'Произошла ошибка')
    }
  },

  rm: async ({ bot, chatId, payload, username }) => {
    try {
      const { data } = await notesId(username)
      await rm(username, data[~~payload - 1].id)
      bot.sendMessage(chatId, 'Удалено')
    } catch (error) {
      console.log(error)
      bot.sendMessage(chatId, 'Произошла ошибка')
    }
  },
}

const config = {
  commands,
  actionsHandler,
}

export default config
