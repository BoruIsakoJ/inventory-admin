from config import Config
from flask import Flask
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from models import db



app = Flask(__name__)
bcrypt = Bcrypt(app)
app.config.from_object(Config)
db.init_app(app)

migrate = Migrate(app,db)



if __name__ == '__main__':
    app.run()