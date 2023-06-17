from Engine.helpers import CheckProfanity
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from werkzeug.security import check_password_hash
from flask_login import current_user
from wtforms import StringField, SubmitField, TextAreaField, PasswordField, HiddenField, TelField
from Engine.models import User
from wtforms.validators import DataRequired, Length, ValidationError

class profileForm(FlaskForm):
    submit = SubmitField('Update')
    
    banner = TextAreaField(id="motto", validators=[DataRequired(),Length(min=20, max=200), CheckProfanity()])
    
    profilePicture = FileField(id='profile-picture-input', validators=[FileAllowed(['jpeg', 'png', 'jpg', 'webp'])])
    
    username = StringField(id='username', validators=[DataRequired(), Length(max=50), CheckProfanity()])
    
    def validate_username(self, username):
        if User.query.filter_by(username=username.data) == True:
            raise ValidationError("Username already taken")

class deleteAccountForm(FlaskForm):
    
    submit = SubmitField('Delete', id="delete-account-proceed")
    
    password = PasswordField(id='delete-account-password-input', validators=[DataRequired()])
    