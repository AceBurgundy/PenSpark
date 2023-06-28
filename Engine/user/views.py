from flask import Blueprint, flash, jsonify, redirect, render_template, request, url_for
from werkzeug.security import check_password_hash, generate_password_hash
from Engine.user.forms import RegisterForm, LoginForm
from flask_login import login_user, logout_user
from Engine.models import User
from sqlalchemy import insert
from Engine import db

# Create a blueprint for user routes
user = Blueprint('user', __name__, template_folder='templates/user', static_folder='static/user')

@user.get("/login")
def login_form():
    """
    Displays login form.

    Returns:
        rendered login.html template with the login form
    """
    logout_user()
    form = LoginForm()
    return render_template("login.html", form=form)

@user.post("/login")
def login():
    """
    Logs user in.

    Returns:
        - JSON response with status=success if login is successful
        - JSON response with status=error, error message, and form errors if login is unsuccessful
    """
    form = LoginForm(request.form)

    email_input = form.login_email.data.strip()
    password_input = form.login_password.data

    user = User.query.filter_by(email=email_input).first()

    if form.validate():
        if user and check_password_hash(user.password, password_input):
            login_user(user)
            return jsonify({
                'status': 'success', 
                'url': url_for('index._index')
            })
        else:
            return jsonify({
                'status': 'error', 
                'message': ["No matching password"]
            })
    else:
        return jsonify({
            'status': 'error', 
            'message': [field.errors for field in form if field.errors]
        })

@user.get("/logout")
def logout():
    """
    Logs user out.

    Returns:
        Redirects to the login_form route
    """
    logout_user()
    return redirect(url_for('user.login_form'))


@user.get("/register")
def register_form():
    """
    Displays registration form.

    Returns:
        rendered register.html template with the registration form
    """
    form = RegisterForm()

    if User.query.count() > 10:
        form.form_errors.append("Your account may not be created")
        form.form_errors.append("Your the 11th user")
        form.form_errors.append("There's a limit of 10 users only")
        
    return render_template("register.html", form=form)


@user.post("/register")
def register():
    """
    Registers user.

    Returns:
        - Redirects to the login_form route if registration is successful
        - Renders the register.html template with form errors if registration is unsuccessful
    """
    form = RegisterForm(request.form)

    if User.query.count() > 10:
        return jsonify({
            'status': 'error', 
            'message': [
                "Account registration failed",
                "To save resources,",
                "We placed a limit of 10 users only",
                "We're sorry for the inconvenience"
            ]
        })

    if form.validate():

        username_input = form.register_username.data
        email_input = form.register_email.data
        password_input = form.register_password.data

        encryptedPassword = generate_password_hash(password_input)

        try:
            db.session.execute(insert(User).values(
                username=username_input,
                email=email_input,
                password=encryptedPassword))

            db.session.commit()
            return jsonify({
                'status': 'success', 
                'url': url_for('user.login_form')
            })
        except:
            return jsonify({
                'status': 'error', 
                'message': ["Error in registering user"]
            })
    else:
        return jsonify({
            'status': 'error', 
            'message': [field.errors for field in form if field.errors]
        })