
import re
from wtforms.validators import DataRequired, Length, ValidationError, Email
from wtforms import StringField, PasswordField, EmailField
from Engine.helpers import CheckProfanity
from flask_wtf import FlaskForm
from Engine.models import User

def validate_username(form, field):
    if not field.data:
        raise ValidationError("Username cannot be empty")

    user = User.query.filter_by(username=field.data).first()

    if user:
        raise ValidationError("Username already taken")

def validate_email(form, field):
    if not field.data:
        raise ValidationError("Email cannot be empty")

    user = User.query.filter_by(email=field.data).first()

    if user:
        raise ValidationError("Email already taken")

def validate_password(form, field):
    if not field.data:
        raise ValidationError("Password cannot be empty")

    # Perform additional password validation logic here
    password = field.data

    # Check for restricted words
    restricted_words = ["password", "123456", "qwerty","where","select","update","delete",".schema","from","drop"]
    
    for word in restricted_words:
        if word.lower() in password.lower():
            raise ValidationError("Password contains a restricted word")

    # Check for restricted characters
    restricted_characters = ["!", "#", "$"]
    for char in restricted_characters:
        if char in password:
            raise ValidationError("Password contains a restricted character")

    # Check for at least one number and one symbol
    if not re.search(r"\d", password):
        raise ValidationError("Password must contain at least one number")

    if not re.search(r"[!@#$%^&*()_+}{\":?></*+[;'./,]", password):
        raise ValidationError("Password must contain at least one symbol")
    
class RegisterForm(FlaskForm):

    register_username = StringField(u'Username', id="username", validators=[
        DataRequired(message="Add a username"),
        Length(min=2, max=50),
        validate_username,
        CheckProfanity()
    ])

    register_email = StringField(u'Email', id="register-email", validators=[
        DataRequired(message="Should be a working email"),
        Email(),
        Length(min=2, max=120),
        validate_email,
    ])

    register_password = PasswordField(u'Password', id="regpassword", validators=[
        DataRequired("Please add a password"),
        Length(min=2, max=40),
        CheckProfanity(),
        validate_password
    ])

class LoginForm(FlaskForm):

    login_email = EmailField(u'Email', id="login-email", validators=[
        DataRequired(message="Should be a working email"), 
        Length(min=2,max=120),
        Email(),
    ])
    
    def validate_login_email(self, login_email):
                
        if "@" not in login_email.data and ".com" not in login_email.data:
            raise ValidationError("Not an email")
        
        if not login_email.data:
            raise ValidationError("Email cannot be empty")
        
        user = User.query.filter_by(email=login_email.data).first()

        if not user:
            raise ValidationError("Email not found or User not yet registered")
    
    login_password = PasswordField(u'Password', id="logpassword", validators=[
        DataRequired("Please add a password"), 
        Length(min=2, max=40),
        CheckProfanity()
    ])

    def validate_login_password(self, login_password):
        if not login_password.data:
            raise ValidationError("Password cannot be empty")