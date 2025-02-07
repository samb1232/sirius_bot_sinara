import os
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.utils import executor

TOKEN = "7724188373:AAEL19ljkwuZJpult3Kl-ajZXn-mwVw5Ddw"  # Укажи свой токен
BASE_DIR = "bot_structure"  # Главная папка

bot = Bot(token=TOKEN)
dp = Dispatcher(bot)
logging.basicConfig(level=logging.INFO)

# Храним текущий путь для каждого пользователя
user_paths = {}

def get_keyboard(path, is_root=False):
    """Создаёт клавиатуру с папками и кнопкой 'Назад'."""
    keyboard = InlineKeyboardMarkup()
    items = os.listdir(path)

    # Проверяем, есть ли в папке только текстовый файл
    txt_files = [f for f in items if f.endswith(".txt")]
    subdirs = [f for f in items if os.path.isdir(os.path.join(path, f))]

    if len(txt_files) == 1 and not subdirs:
        return None  # Если только один текстовый файл — клавиатура не нужна

    for item in subdirs:
        button = InlineKeyboardButton(text=item, callback_data=item)
        keyboard.add(button)

    if not is_root:
        keyboard.add(InlineKeyboardButton(text="⬅️ Назад", callback_data="BACK"))

    return keyboard

@dp.message_handler(commands=["start"])
async def start_command(message: types.Message):
    """Обрабатывает команду /start и показывает главную клавиатуру."""
    user_paths[message.chat.id] = BASE_DIR
    keyboard = get_keyboard(BASE_DIR, is_root=True)

    if keyboard:
        await message.answer("Выберите папку:", reply_markup=keyboard)
    else:
        await send_text_file(message.chat.id, BASE_DIR)

@dp.callback_query_handler(lambda c: True)
async def navigate(callback_query: types.CallbackQuery):
    """Обрабатывает нажатия на кнопки."""
    user_id = callback_query.message.chat.id
    current_path = user_paths.get(user_id, BASE_DIR)

    if callback_query.data == "BACK":
        if current_path == BASE_DIR:
            return  # Если в корневой папке — ничего не делаем
        new_path = os.path.dirname(current_path)
    else:
        new_path = os.path.join(current_path, callback_query.data)

    if os.path.isdir(new_path):
        user_paths[user_id] = new_path
        keyboard = get_keyboard(new_path, is_root=(new_path == BASE_DIR))

        if keyboard:
            await bot.edit_message_text(
                "Выберите папку:", chat_id=user_id, message_id=callback_query.message.message_id, reply_markup=keyboard
            )
        else:
            await send_text_file(user_id, new_path, callback_query.message.message_id)

async def send_text_file(chat_id, path, message_id=None):
    """Отправляет текст из файла и удаляет старое сообщение."""
    txt_files = [f for f in os.listdir(path) if f.endswith(".txt")]

    if len(txt_files) == 1:
        file_path = os.path.join(path, txt_files[0])
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()

        # Удаляем предыдущее сообщение с клавиатурой
        if message_id:
            await bot.delete_message(chat_id, message_id)

        await bot.send_message(chat_id, text)
    else:
        await bot.send_message(chat_id, "Ошибка: Нет файлов для отображения!")

if __name__ == "__main__":
    executor.start_polling(dp, skip_updates=True)