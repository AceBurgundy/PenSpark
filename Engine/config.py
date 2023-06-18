
class Config:
        # Ensure templates are auto-reloaded
    TEMPLATES_AUTO_RELOAD = True

    SECRET_KEY = "02acf27fea4d3c002a063da2e71cf56e866be904fd5467670b99efa8a5d035a1"
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Configure session to use filesystem (instead of signed cookies)
    SESSION_PERMANENT = False
    SESSION_TYPE = "filesystem"