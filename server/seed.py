from models import db,User,UserRole,Category,Supplier,Product
from app import app

with app.app_context():
    Product.query.delete()
    Category.query.delete()
    Supplier.query.delete()
    User.query.delete()
    UserRole.query.delete()
    db.session.commit()
    
    
    admin= UserRole(name="admin")
    local= UserRole(name="local")
    
    db.session.add_all([admin,local])
    db.session.commit()
    
    user1=User(name="admin",email="admin@gmail.com",password_hash="admin",user_role_id=1)
    user2=User(name="staff1",email="staff1@gmail.com",password_hash="staff1",user_role_id=2)
    
    db.session.add_all([user1,user2])
    db.session.commit()

    cat1 = Category(name="Stationery")
    cat2 = Category(name="Electronics")
    db.session.add_all([cat1, cat2])
    db.session.commit()

    supplier1 = Supplier(name="Top Supplies Ltd",email="topsupplies@gmail.com",phone="0722123456",address="Industrial Area, Nairobi")
    supplier2 = Supplier(name="TechSource",email="techsource@gmail.com",phone="0712345678",address="Upper Hill, Nairobi")

    db.session.add_all([supplier1, supplier2])
    db.session.commit()


    product1 = Product(
        name="Notebook A5",
        description="A5 size spiral notebook",
        price=150,
        quantity_in_stock=100,
        category_id=cat1.id,
        supplier_id=supplier1.id
    )
    product2 = Product(
        name="Wireless Mouse",
        description="2.4GHz USB wireless mouse",
        price=1200,
        quantity_in_stock=50,
        category_id=cat2.id,
        supplier_id=supplier2.id
    )
    product3 = Product(
        name="Ballpoint Pens - Pack of 10",
        description="Blue ink ballpoint pens",
        price=200,
        quantity_in_stock=200,
        category_id=cat1.id,
        supplier_id=supplier1.id
    )

    db.session.add_all([product1, product2, product3])
    db.session.commit()

    print("✅ Database seeded successfully!")