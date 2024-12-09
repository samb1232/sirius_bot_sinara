from sqlalchemy import create_engine
from sqlalchemy import Table, Column, Integer, String, MetaData
from sqlalchemy import insert
num_id = 0
role_name = ""
num_data = 0
db = create_engine('sqlite:///users.db')
md = MetaData()

users = Table(
    'users', md,
    Column('id', Integer, primary_key=True),
    Column('role', String),
    Column('creation_date', Integer)
)

md.create_all(db)

def add_user(num_id, role_name, num_data):
    insert_query = insert(users).values(id=num_id, role=role_name, creation_date=num_data)
    with db.connect() as connection:
        connection.execute(insert_query)
print("Для ветки")
