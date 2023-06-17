from flask import render_template, request, url_for, Blueprint
from flask_login import current_user, login_required
from Engine.models import Blog, Like, User
from Engine.helpers import save_picture
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
    
    return render_template(
        "index.html",
        image_file=image_file,
        pageTitle=pageTitle
    )

@index.get('/blogs')
def get_all_blogs():
    """
    Retrieve all blogs excluding the specified post IDs.

    Returns:
        JSON: List of blogs with relevant information.
    """
    post_ids = request.args.getlist('post_ids')
    blogs = Blog.query.filter(~Blog.id.in_(post_ids)).all()
    blog_list = []
    for blog in blogs:
        user_comment = (' '.join(blog.content.split()[:15]) + " ...see more") if len(blog.content.split()) >= 15 else blog.content
        author_username = User.query.filter_by(id=blog.author_id).first().username

        likes = [like.user_id for like in blog.likes]

        blog_list.append({
            'id': blog.id,
            'title': blog.title,
            'content': user_comment,
            'author': author_username,
            'likes': len(blog.likes),
            'liked_by_user': bool(likes.count(current_user.id)),
            'comments': len(blog.comments),
            'date_authored': blog.date_posted.strftime('%B %d, %Y'),
            'time_authored': blog.date_posted.strftime('%I:%M%p')
        })
    return jsonify(blog_list)

@index.post('/blogs')
def create_blog():
    """
    Create a new blog post.

    Returns:
        JSON: Success or error message regarding the blog creation.
    """
    if current_user.get_number_of_blogs() == 5:
        return jsonify({'message': 'A user is limited to 5 blogs only', 'status': 'error'})

    title = request.form.get('title')
    body = request.form.get('body')
    image = request.files.get('image')
    
    if not title or not body:
        return jsonify({'message': 'Fields cannot be empty', 'status': 'error'})

    if len(title) > 100:
        return jsonify({'message': 'Title cannot be greater than 100', 'status': 'error'})
        
    if image:
        blog = Blog(
            title=title, 
            content=body, 
            author_id=current_user.id, 
            image=save_picture(
                location="static/blog_pictures", 
                image=image, 
                image_quality=10,
                as_thumbnail=False
            )
        )
    else:
        blog = Blog(
            title=title, 
            content=body, 
            author_id=current_user.id, 
        )

    db.session.add(blog)
    db.session.commit()

    return jsonify({'message': 'Blog created successfully', 'status': 'success'})

@index.post('/blogs/<int:blog_id>/like')
@login_required  # Requires authentication
def like_blog(blog_id):
    """
    Like or unlike a blog post.

    Args:
        blog_id (int): ID of the blog post.

    Returns:
        JSON: Success or error message regarding the like operation.
    """
    user = current_user.id
    blog = Blog.query.get(blog_id)

    if blog:
        if user in [like.user_id for like in blog.likes]:
            # User already liked the blog, remove the like
            like = Like.query.filter_by(user_id=user, blog_id=blog.id).first()
            db.session.delete(like)
            db.session.commit()
            return jsonify({'message': 'unliked', 'status' : 'success'})
        else:
            # User hasn't liked the blog, add the like
            like = Like(user_id=user, blog_id=blog.id)
            db.session.add(like)
            db.session.commit()
            return jsonify({'message': 'liked', 'status' : 'success'})    
    else:
        return jsonify({'message': 'Blog not found', 'status' : 'error'}), 404
