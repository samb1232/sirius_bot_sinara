from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.utils import executor
from database import add_user
from datetime import datetime

# Токен вашего бота
API_TOKEN = ''

# Инициализация бота, диспетчера и хранилища состояния
bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot, storage=storage)

# Определение состояния
class RegisterStates(StatesGroup):
    NAME = State()
    BIRTHDATE = State()
    ROLE = State()
    INFA = State()
    PHOTO = State()

# Команда /start
@dp.message_handler(commands=['start'])
async def start_command(message: types.Message):
    user_id = message.from_user.id
    if check_user_exists(user_id):
        await message.answer("Вы уже зарегистрированы!")
    else:
        await message.answer("Добро пожаловать! Начнем регистрацию. Введите ваше имя (только буквы):")
        await RegisterStates.NAME.set()

# Обработка имени
@dp.message_handler(state=RegisterStates.NAME)
async def process_name(message: types.Message, state: FSMContext):
    if not message.text.isalpha():
        await message.answer("Имя может содержать только буквы. Попробуйте снова:")
        return
    async with state.proxy() as data:
        data['name'] = message.text
    await message.answer("Введите вашу дату рождения (в формате ДД.ММ.ГГГГ):")
    await RegisterStates.BIRTHDATE.set()

# Обработка даты рождения
@dp.message_handler(state=RegisterStates.BIRTHDATE)
async def process_birthdate(message: types.Message, state: FSMContext):
    try:
        birthdate = datetime.strptime(message.text, '%d.%m.%Y')
        if birthdate >= datetime.now():
            raise ValueError
        async with state.proxy() as data:
            data['birthday'] = message.text
        await message.answer("Укажите вашу должность:")
        await RegisterStates.ROLE.set()
    except ValueError:
        await message.answer("Некорректная дата. Убедитесь, что формат ДД.ММ.ГГГГ и дата реальна. Попробуйте снова:")

# Обработка должности
@dp.message_handler(state=RegisterStates.ROLE)
async def process_role(message: types.Message, state: FSMContext):
    if not message.text.strip() or message.text.startswith('/'):
        await message.answer("Поле должности обязательно и не может содержать команды. Укажите вашу должность:")
        return
    async with state.proxy() as data:
        data['role'] = message.text
    await message.answer("Расскажите немного о себе (увлечения, хобби) или оставьте поле пустым:")
    await RegisterStates.INFA.set()

# Обработка дополнительной информации
@dp.message_handler(state=RegisterStates.INFA)
async def process_infa(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['infa'] = message.text if message.text.strip() else ''
    await message.answer("Отправьте вашу фотографию:")
    await RegisterStates.PHOTO.set()

# Обработка фотографии
@dp.message_handler(content_types=['photo'], state=RegisterStates.PHOTO)
async def process_photo(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        # Скачивание фото
        photo = message.photo[-1]
        photo_file = await photo.download(destination_file='user_photo.jpg')
        with open('user_photo.jpg', 'rb') as f:
            photo_blob = f.read()

        # Сохранение данных в базу
        add_user(
            num_id=message.from_user.id,
            name=data['name'],
            role_name=data['role'],
            birthday=data['birthday'],
            infa=data.get('infa', ''),
            photo_blob=photo_blob,
            creation_date=datetime.now()
        )
    await message.answer("Регистрация завершена! Спасибо!")
    await state.finish()

# Обработчик ошибок для отсутствия фото
@dp.message_handler(state=RegisterStates.PHOTO, content_types=types.ContentType.ANY)
async def invalid_photo(message: types.Message):
    await message.answer("Пожалуйста, отправьте фотографию, а не текст или другой файл!")

# Проверка наличия пользователя в базе
def check_user_exists(user_id):
    # Пример функции для проверки в базе
    # Верните True, если пользователь зарегистрирован, иначе False
    return False  # Замените логикой работы с вашей базой данных

# Запуск бота
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=False)