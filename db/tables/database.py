import sqlalchemy as db
from db.db_base import db_base

class User(db_base.Base):
    __tablename__ = 'users'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    role = db.Column(db.String, nullable=False)
    birthday = db.Column(db.Date)
    infa = db.Column(db.String)
    photo = db.Column(db.BLOB)
    creation_date = db.Column(db.DateTime)