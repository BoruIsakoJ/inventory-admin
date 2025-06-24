from config import Config
from flask import Flask,request,session,make_response
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api,Resource
from models import db,User
from flask_cors import CORS,cross_origin



app = Flask(__name__)
bcrypt = Bcrypt(app)
api=Api(app)
app.config.from_object(Config)
db.init_app(app)
CORS(app, supports_credentials=True)

migrate = Migrate(app,db)


class Register(Resource):
    def post(self):
        data=request.get_json()
        
        name = data.get('name')
        email= data.get('email')
        password= data.get('password')
        
        try:
            new_user = User(name=name, email=email, password_hash=password)
            db.session.add(new_user)
            db.session.commit()
            session['user_id']=new_user.id
            
            return make_response(
                new_user.to_dict(),
                201
            )
            
        except IntegrityError:
            db.session.rollback()
            return make_response(
                {'error': 'Email already exists. Please use a different email.'},
                409
            )
        
        except KeyError as e:
            db.session.rollback()
            return make_response(
                {'error':f'Missing required field: {str(e)}'},
                400
            )
        except ValueError as e:
            db.session.rollback()
            return make_response(
                {'error': str(e)},
                400
            )
        

class Login(Resource):
    def post(self):
        data=request.get_json()
        
        email= data.get('email')
        password= data.get('password')
        
        if not email:
            return make_response(
                {'error':'Enter your email address'}
            )
        if not password:
            return make_response(
                {'error':'Enter your password'}
            )
        
        user = User.query.filter(User.email==email).first()
        if user and user.authenticate(password):
            session['user_id']=user.id
            return make_response(
                user.to_dict(),
                200
            )
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )



api.add_resource(Register, '/register')
api.add_resource(Login, '/login')

if __name__ == '__main__':
    app.run()