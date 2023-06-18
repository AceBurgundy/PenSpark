from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask import Flask

login_manager = LoginManager()
login_manager.login_view = 'user.login'

db = SQLAlchemy()

def create_app():

    app = Flask(__name__)
    app.config['SECRET_KEY'] = "02acf27fea4d3asdasdfasfde325232345wetg4qbg43c002a063da2e71cf56e866be904fd5467670b99efa8a5d035a1"
    app.config['SECRET_KEY'] = "filesystem"
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

    login_manager.init_app(app)
    db.init_app(app)

    from Engine.user.views import user
    from Engine.blog.views import blog
    from Engine.index.views import index
    from Engine.profile.views import profile
    from Engine.errors.handlers import errors

    app.register_blueprint(user)
    app.register_blueprint(blog)
    app.register_blueprint(profile)
    app.register_blueprint(index)
    app.register_blueprint(errors)

    return app
