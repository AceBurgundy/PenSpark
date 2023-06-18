from datetime import datetime
import os

from flask import current_app, url_for
from Engine import db, login_manager
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

class User(db.Model, UserMixin):

    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    banner = db.Column(db.String(200), default="Give a small introduction about yourself")
    email = db.Column(db.String(120), unique=True, nullable=False)
    profile_picture = db.Column(db.String(100), nullable=False, default='default.jpg')
    password = db.Column(db.String(200), nullable=False)
    creation_date = db.Column(db.DateTime(), default=datetime.now)
    last_online = db.Column(db.DateTime(), default=datetime.now, onupdate=datetime.now)
    night_mode = db.Column(db.Boolean(), nullable=False, default=True)

    def get_number_of_blogs(self):
        return Blog.query.filter_by(author_id=self.id).count()

    def get_number_of_comments(self, blog_id):
        return Comment.query.filter_by(user_id=self.id, blog_id=blog_id).count()

    # delete the user
    def delete(self):

        # Delete the image if it exists and if the profile picture isn't the default profile picture
        if self.profile_picture and self.profile_picture != "default.jpg":
            image_path = os.path.join(current_app.static_folder, 'profile_pictures', self.profile_picture)
            if os.path.exists(image_path):
                os.remove(image_path)

        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return f"User('{self.username}', '{self.profile_picture}', night mode: {self.night_mode}) "

class Blog(db.Model):
    __tablename__ = 'blog'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(100))
    date_posted = db.Column(db.DateTime(), default=datetime.now)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    likes = db.relationship('Like', backref='blog', lazy=True, cascade="all, delete-orphan")
    comments = db.relationship('Comment', backref='blog', lazy=True, cascade="all, delete-orphan")
    
    def delete(self):
        # Delete the image if it exists
        if self.image:
            image_path = os.path.join(current_app.static_folder, 'blog_pictures', self.image)
            if os.path.exists(image_path):
                os.remove(image_path)

        # Delete the blog
        db.session.delete(self)
        db.session.commit()   

    def __repr__(self):
        return f"Blog('{self.title}', '{self.date_posted}')"

class Like(db.Model):
    __tablename__ = 'like'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f"Like('{self.user_id}', '{self.blog_id}')"

class Comment(db.Model):
    __tablename__ = 'comment'

    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime(), default=datetime.now)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog.id', ondelete='CASCADE'), nullable=False)

    def __repr__(self):
        return f"Comment('{self.text}', '{self.date_posted}')"
