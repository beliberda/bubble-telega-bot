const TelegramApi = require("node-telegram-bot-api");
const {gameOption, againOptions} = require('./options.js')
//Token from telegram bot PenaBubbleBot
const token = "5652602868:AAFjbrc-GYQdQarJTM773dLSUXAGUlDI9Do";

const bot = new TelegramApi(token, { polling: true });

//Аналог базы данных для хранения
const chat = {};



const startGame = async (chatId) => {
  await bot.sendMessage(chatId, "Я загадал число от 0 до 9, попробуй угадать");
  const randomNumber = Math.floor(Math.random() * 10);
  chat[chatId] = randomNumber;
  bot.sendMessage(chatId, "Поехали!", gameOption);
};

const start = async () => {
  // Установка команд для бота
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация" },
    { command: "/game", description: "Поиграть" },
  ]);

  //Функция отправки
  bot.on("message", async (msg) => {
    const text = msg.text; //взятие по api текста и прочего
    const chatId = msg.chat.id;
    const userName = msg.chat.username;
    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/1b5/0ab/1b50abf8-8451-40ca-be37-ffd7aa74ec4d/5.webp"
      );
      return bot.sendMessage(chatId, `Добро пожаловать, ${userName}!`); //Отправка пользователю чего либо
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Что вы хотите?");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data == "/again") {
      return await startGame(chatId);
    }
    if (data == chat[chatId]) {
      return await bot.sendMessage(
        chatId,
        `Мои поздравления! ты отгадал цифру ${chat[chatId]}`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `Ты не угадал, моя цифра - ${chat[chatId]}, а твоя ${data}`,
        againOptions
      );
    }
  });
};
try {
  start();
} catch (error) {
  console.log(error);
}
