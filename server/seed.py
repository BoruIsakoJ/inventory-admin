from models import db,User,UserRole
from app import app

with app.app_context():
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