from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property


db = SQLAlchemy()


class User(db.Model,SerializerMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String, nullable= False)
    email=db.Column(db.String, nullable=False, unique=True)
    _password_hash=db.Column(db.String, nullable=False)
    user_role_id=db.Column(db.Integer, db.ForeignKey('user_roles.id'),default=2)
    
    user_role = db.relationship("UserRole", backref='users')
    
    serialize_rules = ('-user_role_id', '-_password_hash', 'user_role')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'user_role': self.user_role.name if self.user_role else None,
            'user_role_id': self.user_role_id
        }

    
    def __repr__(self):
        return f'<User {self.name}, {self.email}>'
    
    
    
    validates('name')
    def validate_name(self,key,name):
        if not name:
            raise ValueError('Name must not be empty')
        return name
    
    @validates('email')
    def validate_email(self,key,email):
        if not email:
            raise ValueError('Email must not be empty')
        
        if '@' not in email:
            raise ValueError('Invalid email address. Address must have \'@\' symbol')
        
        return email
    
    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self,password):
        from app import bcrypt
        password_hash =bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
        
    def authenticate(self,password):
        from app import bcrypt
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    
    

class UserRole(db.Model,SerializerMixin):
    __tablename__='user_roles'
    
    id=db.Column(db.Integer, primary_key=True)
    name=db.Column(db.String, nullable=False)
    
    serialize_rules=('-users',)
    
    def __repr__(self):
        return f'<UserRole {self.name}>'
    



class Product(db.Model,SerializerMixin):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=True)
    price = db.Column(db.Integer, nullable=False)
    quantity_in_stock = db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    supplier_id = db.Column(db.Integer, db.ForeignKey('suppliers.id'), nullable=False)
    
    
    category = db.relationship("Category", back_populates="products")
    supplier = db.relationship("Supplier", back_populates="products")

    serialize_rules = ('category.name', 'supplier.name')

    def __repr__(self):
        return f"<Product(id={self.id} name={self.name}, price={self.price}, quantity_in_stock={self.quantity_in_stock})>"
    
class Category(db.Model,SerializerMixin):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    products = db.relationship("Product", back_populates="category")

    serialize_rules = ('-products',)

    def __repr__(self):
        return f"<Category(id={self.id} name={self.name})>"
    
    
class Supplier(db.Model,SerializerMixin):
    __tablename__ = 'suppliers'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email = db.Column(db.String)
    phone = db.Column(db.String)
    address = db.Column(db.String)
    products = db.relationship("Product", back_populates="supplier")
    serialize_rules = ('-products',)
    def __repr__(self):
        return f"<Supplier(id={self.id} name={self.name} contact_info={self.contact_info})>"