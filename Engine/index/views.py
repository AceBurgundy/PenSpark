from flask import render_template, request, url_for, Blueprint
from Engine.blog.forms import CreateBlogForm
from flask_login import current_user, login_required
from Engine.models import Blog, Like, User
from Engine.helpers import ALLOWED_IMAGE_FORMATS, save_picture
from flask import request
from flask import jsonify
from Engine import db

index = Blueprint('index', __name__, template_folder='templates/index', static_folder='static/index')

@index.get("/night-mode")
def get_current_mode():
    """
    Retrieve the current night mode setting for the user.

    Returns:
        JSON: The current night mode setting.
    """
    return jsonify({"mode": current_user.night_mode})

@index.post("/night-mode")
def set_current_mode():
    """
    Set the current night mode setting for the user.

    Returns:
        JSON: Success status of setting the mode.
    """
    mode = request.form.get("mode")

    if mode == "Day":
        current_user.night_mode = False
        db.session.commit()
        return jsonify({"status": True})
    
    if mode == "Night":
        current_user.night_mode = True
        db.session.commit()
        return jsonify({"status": True})

    return jsonify({"status": "error", "message": "Error in setting mode"})

@index.get("/")
@login_required
def _index():
    """
    Load the root page.

    Returns:
        render_template: Rendered HTML template with necessary data.
    """
    pageTitle = "DASHBOARD"
    image_file = url_for(
        'static',
        filename='profile_pictures/' + current_user.profile_picture
    )
    
    form = CreateBlogForm()
    return render_template(
        "index.html",
        image_file=image_file,
        pageTitle=pageTitle,
        form=form
    )

@index.get("/about")
def about():
    """
    Load the about page.

    Returns:
        render_template: Rendered HTML template with necessary data.
    """
    pageTitle = "DASHBOARD"
    image_file = url_for(
        'static',
        filename='profile_pictures/' + current_user.profile_picture
    )
    
    return render_template(
        "about.html",
        image_file=image_file,
        pageTitle=pageTitle
    )

