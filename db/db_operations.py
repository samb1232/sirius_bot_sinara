from __future__ import annotations

import logging

import sqlalchemy as db
from sqlalchemy.orm import sessionmaker


from db.tables.database import User
from db.db_base import db_base

logger = logging.getLogger(__name__)

DATABASE_ENGINE = "sqlite:///database.db"

class  DbHelper:
    logger.debug("Подключение к базе данных")
    engine = db.create_engine(DATABASE_ENGINE)

    db_base.Base.metadata.create_all(engine)

    session = sessionmaker(bind=engine)()

    @staticmethod
    def add_user(user_id, name, role, birthday, infa, photo, creation_date):
        logger.debug(f"добавление пользователя с ID {user_id}")
        new_user = User(user_id=user_id,
                        name=name,
                        role=role,
                        birthday=birthday,
                        infa=infa,
                        photo=photo,
                        creation_date=creation_date
                        )
        DbHelper.session.add(new_user)
        DbHelper.session.commit()

    @staticmethod
    def get_user(user_id) -> User | None: #Возвращает объект User по ID
        logger.debug(f"Получение имя пользователя с ID {user_id}")
        return DbHelper.session.query(User).filter(User.user_id == user_id).first()

    @staticmethod
    def update_user(user: User) -> None: #обновление инфы о пользователе
        logger.debug(f"Обновление данных пользователя с ID {user.user_id}")
        existing_user = DbHelper.get_user(user.user_id)
        if existing_user:
            existing_user.name = user.name
            existing_user.role = user.role
            existing_user.birthday = user.birthday
            existing_user.infa = user.infa
            existing_user.photo = user.photo
        else:
            logger.warning(f"Пользователь с ID {user.user_id} не найден")