from config import Config
from flask import Flask,request,session,make_response
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api,Resource
from models import db,User,UserRole,Category,Product,Supplier
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
            

class Logout(Resource):
    def delete(self):
        if session['user_id']:
            session['user_id'] = None
            return make_response(
                {'message':'Successfully logged out. See you later.'},
                200
            )
        return make_response(
            {'error':'You are not logged in'},
            401
        )

class UsersResource(Resource):
    def get(self):
        if session['user_id']:
            if session.get('user_id'):
                users = User.query.all()
                return make_response([user.to_dict() for user in users], 200)
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
    
    def post(self):
        if session['user_id']:
            data=request.get_json()
        
            name = data.get('name')
            email= data.get('email')
            password= data.get('password')
            user_role_id=data.get('user_role_id')
            
            try:
                new_user = User(name=name, email=email, password_hash=password,user_role_id=user_role_id)
                db.session.add(new_user)
                db.session.commit()
                
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

class UserResourceById(Resource):
    def get(self,id):
        if session['user_id']:
            user=User.query.filter(User.id==id).first()
            if not user:
                return make_response(
                    {'message':'User does not exists'},
                    400
                )
            return make_response(
                user.to_dict(),
                200
            )
            


    def patch(self, id):
        if session['user_id']:
            user = User.query.filter(User.id==id).first()
            data=request.get_json()
            print("PATCH DATA:", data)

            for attr, value in data.items():
                if attr == 'user_role':
                    role = UserRole.query.filter(UserRole.id==value).first()
                    if not role:
                        return make_response({'error': 'Invalid role ID'}, 400)
                    user.user_role = role  
                else:
                    setattr(user, attr, value)

                
            db.session.add(user)
            db.session.commit()
            
            return make_response(
                user.to_dict(),
                200
            )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )    
            

    
    def delete(self,id):
        if session['user_id']:
            user = User.query.filter(User.id==id).first()
            if not user:
                return make_response({'error': 'User not found'}, 404)
            
            db.session.delete(user)
            db.session.commit()
            
            return make_response(
                {
                    'id':user.id,
                    'name':user.name,
                    'email':user.email
                },
                200
            )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
                   
            
class CategoryResource(Resource):
    def get(self):
        if session['user_id']:
            categories_dict=[category.to_dict() for category in Category.query.all()]
            return make_response(
                categories_dict,
                200
            )
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
    
    def post(self):
        if session['user_id']:
            data = request.get_json()

            name=data.get('name')

            new_category=Category(name=name)

            db.session.add(new_category)
            db.session.commit()
            return make_response(
                new_category.to_dict(),
                201
            )
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )


class CategoryByIdResource(Resource):
    def get(self,id):
        if session['user_id']:
            category = Category.query.filter(Category.id==id).first()
            if category:
                return make_response(
                    category.to_dict(),
                    200
                )
            else:
                return make_response(
                    {'message':'Category does not exists'},
                    400
                )
            
    def patch(self,id):
        if session['user_id']:
            category = Category.query.filter(Category.id==id).first()
            if category:
                data=request.get_json()
                name=data.get('name')

                category.name= name  

                db.session.commit()

                return make_response(
                    category.to_dict(),
                    201
                )
            else:
                return make_response(
                    {'message':'Product does not exists'},
                    400
                )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
        
    
    def delete(self,id):
        if session['user_id']:
            category = Category.query.filter(Category.id==id).first()
            if category:
                db.session.delete(category)
                db.session.commit()

                return make_response(
                {
                    'id':category.id,
                    'name':category.name
                },
                200
            )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )


class ProductResource(Resource):
    def get(self):
        if session['user_id']:
            products_dict=[product.to_dict() for product in Product.query.all()]
            return make_response(
                products_dict,
                200
            )
        
    def post(self):
        if session['user_id']:
            data=request.get_json()

            name=data.get('name')
            price=data.get('price')
            stock=data.get('stock')
            category_id=data.get('category_id')
            if not Category.query.filter(Category.id==category_id).first():
                return make_response({"error": "Category ID does not exist"}, 400)
            supplier_id=data.get('supplier_id')
            if not Supplier.query.filter(Supplier.id==supplier_id).first():
                return make_response({"error": "Supplier ID does not exist"}, 400)

            new_product=Product(name=name,price=price,quantity_in_stock=stock,category_id=category_id,supplier_id=supplier_id)

            db.session.add(new_product)
            db.session.commit()

            return make_response(
                new_product.to_dict(),
                201
            )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )


class ProductByIDResource(Resource):
    def get(self,id):
        if session['user_id']:
            product = Product.query.filter(Product.id == id).first()
            if product:
                return make_response(
                    product.to_dict(),
                    200
                )
            else:
                return make_response(
                    {'message':'Product does not exists'},
                    404
                )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
        
    def patch(self,id):
        if session['user_id']:
            product = Product.query.filter(Product.id == id).first()
            if product:
                data = request.get_json()
                for attr in data:
                    setattr(product,attr,data.get(attr))

                db.session.commit()
                return make_response(
                    product.to_dict(),
                    200
                )
            
            else:
                return make_response(
                    {'message':'Product does not exists'},
                    404
                )
        
        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
            
    def delete(self,id):
        if session['user_id']:
            product = Product.query.filter(Product.id == id).first()
            if product:
                db.session.delete(product)
                db.session.commit()

                return make_response(
                    {'message':'Deleted successfully'},
                    200
                )
            
            else:
                return make_response(
                    {'message':'Product does not exists'},
                    404
                )

        else:
            return make_response(
                {'error':'Unauthorized'},
                401
            )
            




api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout,'/logout')
api.add_resource(UsersResource,'/users')
api.add_resource(UserResourceById, '/users/<int:id>')
api.add_resource(CategoryResource,'/categories')
api.add_resource(CategoryByIdResource,'/categories/<int:id>')
api.add_resource(ProductResource,'/products')
api.add_resource(ProductByIDResource,'/products/<int:id>')

if __name__ == '__main__':
    app.run()