from aiogram import Bot, Dispatcher, types
from aiogram.contrib.fsm_storage.memory import MemoryStorage
from aiogram.dispatcher import FSMContext
from aiogram.dispatcher.filters.state import State, StatesGroup
from aiogram.utils import executor
from database import add_user

# Токен вашего бота

#!!!!!!!!!!! Токен моего тестого БОТА
API_TOKEN = '7568009244:AAH1ygFgsAC1vn9niSRNoOsaOAaVwZZDVVA'
#TODO Сделать проверку правильности ввода данных в дате (1)
#TODO Сделать Обязательными некоторые поля (имя,дата рождения,фото,должность)



# Инициализация бота, диспетчера и хранилища состояния
bot = Bot(token=API_TOKEN)
storage = MemoryStorage()
dp = Dispatcher(bot,storage=storage)


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
    await message.answer("Привет! Нажми /register, чтобы начать регистрацию.")

# Команда /register
@dp.message_handler(commands=['register'])
async def register_command(message: types.Message):
    await message.answer("Введите ваше имя:")
    await RegisterStates.NAME.set()

# Обработка имени
@dp.message_handler(state=RegisterStates.NAME)
async def process_name(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['name'] = message.text
    await message.answer("Введите вашу дату рождения (в формате ДД.ММ.ГГГГ):")
    await RegisterStates.BIRTHDATE.set()

# Обработка даты рождения
@dp.message_handler(state=RegisterStates.BIRTHDATE)
async def process_birthdate(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        #TODO(1)
        data['birthday'] = message.text
    await message.answer("Укажите вашу должность:")
    await RegisterStates.ROLE.set()

# Обработка должности
@dp.message_handler(state=RegisterStates.ROLE)
async def process_role(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['role'] = message.text
    await message.answer("Расскажите немного о себе (увлечения, хобби):")
    await RegisterStates.INFA.set()

# Обработка дополнительной информации
@dp.message_handler(state=RegisterStates.INFA)
async def process_infa(message: types.Message, state: FSMContext):
    async with state.proxy() as data:
        data['infa'] = message.text
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
        add_user(num_id=message.from_user.id,name=data['name'],role_name=data['role'],birthday=data['birthday'],infa=data['infa'],photo_blob=photo_blob,creation_date=123)


    await message.answer("Регистрация завершена! Спасибо!")
    await state.finish()

# Обработчик ошибок для отсутствия фото
@dp.message_handler(state=RegisterStates.PHOTO)
async def invalid_photo(message: types.Message):
    await message.answer("Пожалуйста, отправьте фото!")

# Запуск бота
if __name__ == '__main__':
    executor.start_polling(dp, skip_updates=False)