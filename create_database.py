from Engine import create_app
from Engine import db

app = create_app()
with app.app_context():
    db.create_all()
