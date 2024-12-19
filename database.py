from sqlalchemy import create_engine
from sqlalchemy import Table, Column, Integer, String, MetaData, BLOB
from sqlalchemy import insert
num_id = 0
role_name = ""
num_data = 0
db = create_engine('sqlite:///users.db')
md = MetaData()

users = Table(
    'users', md,
    Column('id', Integer, primary_key=True),
    Column('name', String),
    Column('role', String),
    Column("birthday", Integer),
    Column("infa", String),
    Column("photo", BLOB),
    Column('creation_date', Integer)
)

md.create_all(db)

def add_user(num_id, name, role_name, birthday, infa, photo_blob, creation_date):
    insert_query = insert(users).values(
        id=num_id,
        name=name,
        role=role_name,
        birthday=birthday,
        infa=infa,
        photo=photo_blob,
        creation_date=creation_date
    )
    with db.connect() as connection:
        connection.execute(insert_query)