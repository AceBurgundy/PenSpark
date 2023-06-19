from wtforms.validators import DataRequired, Length, ValidationError
from Engine.helpers import ALLOWED_IMAGE_FORMATS, CheckProfanity
from wtforms import StringField, TextAreaField, FileField
from flask_wtf import FlaskForm

class CreateBlogForm(FlaskForm):

    title = StringField('Title', id="create-blog__title", validators=[DataRequired(message="Title Needed"), Length(max=100), CheckProfanity(message="not accepted")])
    body = TextAreaField('Body', id="create-blog__body", validators=[DataRequired(message="Content Required"), Length(max=750), CheckProfanity(message="not accepted")])
    image = FileField('Image', id="create-blog__bottom-image")

    def validate_image(self, field):
        # Custom validation for image format
        if field.data:
            if field.data.filename.lower().split('.')[-1] not in ALLOWED_IMAGE_FORMATS:
                raise ValidationError('Only image files are allowed for the image.')
