from config import Config
from flask import Flask,request,session,make_response,render_template
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api,Resource
from models import db,User,UserRole,Category,Product,Supplier
from flask_cors import CORS



app = Flask(
    __name__,
    static_url_path='',
    static_folder='../client/build',
    template_folder='../client/build'
)

bcrypt = Bcrypt(app)
api=Api(app)
app.config.from_object(Config)
db.init_app(app)
CORS(app, supports_credentials=True)

migrate = Migrate(app,db)

first_request = True


@app.route('/')
def index():
    return render_template("index.html")


@app.before_request
def create_default_roles():

    admin = UserRole.query.filter_by(name='admin').first()
    local = UserRole.query.filter_by(name='local').first()

    if not admin:
        db.session.add(UserRole(name='admin'))
    if not local:
        db.session.add(UserRole(name='local'))

    db.session.commit()

    user1 = User.query.filter(User.id==1).first()
    if not user1:
        user1 = User(name="admin", email="admin@gmail.com",password_hash="admin",user_role_id=1)
        db.session.add(user1)  
    
    db.session.commit()
    first_request = False


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
                422
            )
            

class Logout(Resource):
    def delete(self):
        user_id = session.get('user_id')  

        if user_id:
            session.pop('user_id', None) 
            return make_response(
                {'message': 'Successfully logged out. See you later.'},
                200
            )

        return make_response(
            {'error': 'You are not logged in'},
            422
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
                422
            )
    
    def post(self):
        if session['user_id']:
            if User.query.filter(User.id==session['user_id']).first().user_role.name != 'admin':
                return make_response(
                    {'error':'Unauthorized'},
                    422
                )
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
    def get(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        user = User.query.get(id)
        if not user:
            return make_response({'message': 'User does not exist'}, 404)

        return make_response(user.to_dict(), 200)


    def patch(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        user = User.query.get(id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        data = request.get_json()
        print("PATCH DATA:", data)

        for attr, value in data.items():
            if attr == 'user_role':
                role = UserRole.query.get(value)
                if not role:
                    return make_response({'error': 'Invalid role ID'}, 400)
                user.user_role = role
            else:
                setattr(user, attr, value)

        db.session.commit()
        return make_response(user.to_dict(), 200)


    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        user = User.query.get(id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        db.session.delete(user)
        db.session.commit()

        return make_response(
            {'id': user.id, 'name': user.name, 'email': user.email},
            200
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
                422
            )
    
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        data = request.get_json()
        name = data.get('name')

        if not name:
            return make_response({'error': 'Name is required'}, 400)

        new_category = Category(name=name)
        db.session.add(new_category)
        db.session.commit()

        return make_response(new_category.to_dict(), 201)


class CategoryByIdResource(Resource):
    def get(self, id):
        if not session.get('user_id'):
            return make_response({'error': 'Unauthorized'}, 422)

        category = Category.query.get(id)
        if not category:
            return make_response({'error': 'Category does not exist'}, 404)

        return make_response(category.to_dict(), 200)

    def patch(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        category = Category.query.get(id)
        if not category:
            return make_response({'error': 'Category does not exist'}, 404)

        data = request.get_json()
        name = data.get('name')

        if name:
            category.name = name
            db.session.commit()

        return make_response(category.to_dict(), 200)

    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        category = Category.query.get(id)
        if not category:
            return make_response({'error': 'Category does not exist'}, 404)

        db.session.delete(category)
        db.session.commit()

        return make_response(
            {'id': category.id, 'name': category.name},
            200
        )



class ProductResource(Resource):
    def get(self):
        if session['user_id']:
            products_dict=[product.to_dict() for product in Product.query.all()]
            return make_response(
                products_dict,
                200
            )
        else:
            return make_response(
                {'error':'Unauthorized'},
                422
            )
        
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        data = request.get_json()
        name = data.get('name')
        description = data.get('description')
        price = data.get('price')
        stock = data.get('quantity_in_stock')
        category_id = data.get('category_id')
        supplier_id = data.get('supplier_id')

        if not Category.query.get(category_id):
            return make_response({"error": "Category ID does not exist"}, 400)
        if not Supplier.query.get(supplier_id):
            return make_response({"error": "Supplier ID does not exist"}, 400)

        new_product = Product(name=name,description=description,price=price,quantity_in_stock=stock,category_id=category_id,supplier_id=supplier_id)

        db.session.add(new_product)
        db.session.commit()

        return make_response(new_product.to_dict(), 201)

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
                422
            )
        
    def patch(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        product = Product.query.get(id)
        if not product:
            return make_response({'error': 'Product does not exist'}, 404)

        data = request.get_json()
        for attr, value in data.items():
            if hasattr(product, attr):
                setattr(product, attr, value)

        db.session.commit()
        return make_response(product.to_dict(), 200)

    def delete(self, id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        product = Product.query.get(id)
        if not product:
            return make_response({'error': 'Product does not exist'}, 404)

        db.session.delete(product)
        db.session.commit()

        return make_response({'message': 'Deleted successfully'}, 200)


class SupplierResource(Resource):
    def get(self):
        if session['user_id']:
            supplier_dict = [supplier.to_dict() for supplier in Supplier.query.all()]
            return make_response(
                supplier_dict,
                200
            )
        else:
            return make_response(
                {'error':'Unauthorized'},
                422
            )
        
    def post(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        data = request.get_json()
        name = data.get('name')
        phone = data.get('phone')
        email = data.get('email')
        address = data.get('address')

        new_supplier = Supplier(name=name, phone=phone, email=email, address=address)

        db.session.add(new_supplier)
        db.session.commit()

        return make_response(new_supplier.to_dict(), 201)
        
class SupplierByIdResource(Resource):
    def get(self,id):
        if not session.get('user_id'):
            return make_response({'error': 'Unauthorized'}, 422)

        supplier = Supplier.query.get(id)
        if supplier:
            return make_response(supplier.to_dict(), 200)
        else:
            return make_response({'message': 'Supplier does not exist'}, 404)

    def patch(self,id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        supplier = Supplier.query.get(id)
        if not supplier:
            return make_response({'message': 'Supplier does not exist'}, 404)

        data = request.get_json()
        for attr, value in data.items():
            if hasattr(supplier, attr):
                setattr(supplier, attr, value)

        db.session.commit()
        return make_response(supplier.to_dict(), 200)

    def delete(self,id):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        current_user = User.query.get(user_id)
        if not current_user or current_user.user_role.name != 'admin':
            return make_response({'error': 'Admins only'}, 422)

        supplier = Supplier.query.get(id)
        if not supplier:
            return make_response({'message': 'Supplier does not exist'}, 404)

        db.session.delete(supplier)
        db.session.commit()
        return make_response({'message': 'Deleted successfully'}, 200)


class Me(Resource):
    def get(self):
        user_id = session.get('user_id')
        if not user_id:
            return make_response({'error': 'Unauthorized'}, 422)

        user = User.query.get(user_id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        return {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'user_role': user.user_role.name
        }, 200



api.add_resource(Register, '/register')
api.add_resource(Login, '/login')
api.add_resource(Logout,'/logout')
api.add_resource(UsersResource,'/users')
api.add_resource(UserResourceById, '/users/<int:id>')
api.add_resource(CategoryResource,'/categories')
api.add_resource(CategoryByIdResource,'/categories/<int:id>')
api.add_resource(ProductResource,'/products')
api.add_resource(ProductByIDResource,'/products/<int:id>')
api.add_resource(SupplierResource,'/suppliers')
api.add_resource(SupplierByIdResource,'/suppliers/<int:id>')
api.add_resource(Me, '/me')



