from wtforms.validators import DataRequired, Length, ValidationError
from Engine.helpers import ALLOWED_IMAGE_FORMATS, CheckProfanity
from wtforms import StringField, TextAreaField, FileField
from flask_wtf import FlaskForm

class CreateBlogForm(FlaskForm):

    title = StringField('Title', id="create-blog__title", validators=[DataRequired(message="Title Needed"), Length(max=100), CheckProfanity(message="not accepted")])
    body = TextAreaField('Body', id="create-blog__body", validators=[DataRequired(message="Content Required"), Length(max=3000), CheckProfanity(message="not accepted")])
    image = FileField('Image', id="create-blog__bottom-image")
