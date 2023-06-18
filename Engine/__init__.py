from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from Engine import blog
from flask_login import LoginManager
from Engine.config import Config

login_manager = LoginManager()
login_manager.login_view = 'user.login'

db = SQLAlchemy()

def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(Config)

    app.secret_key = Config.SECRET_KEY
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
