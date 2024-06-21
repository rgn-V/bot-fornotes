import TelegramBot from 'node-telegram-bot-api'
import config from './business'

/**@type { import('./business').ReadLineList } */
const readLineList = {}

const bot = new TelegramBot(process.env.TG_TOKEN, { polling: true })

bot.setMyCommands(config.commands)

bot.on('message', async (msg) => {
  const { id: chatId, username } = msg.chat

  if (!username || !msg.text) {
    return
  }

  const { action } = readLineList[username]

  const command = config.commands.find(({ command }) => command === msg.text)
  const actionHandler = config.actionsHandler[action]

  if (!actionHandler && !command) {
    return
  }

  if (command) {
    await command.handler({ bot, chatId, readLineList, username })
  }

  if (actionHandler && msg.text) {
    await actionHandler({ bot, chatId, payload: msg.text, username })
    delete readLineList[username]
  }

  // Выходим если нет команды и не ожидается ввод.
})
