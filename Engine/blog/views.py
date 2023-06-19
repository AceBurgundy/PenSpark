from flask import redirect, render_template, request, url_for, Blueprint
from Engine.blog.forms import CreateBlogForm
from Engine.helpers import ALLOWED_IMAGE_FORMATS, save_picture
from flask_login import current_user, login_required
from Engine.models import Blog, Comment, Like, User
from Engine import db
from flask import request
from flask import jsonify

blog = Blueprint('blog', __name__, template_folder='templates/blog',
                  static_folder='static/blog', )

@blog.get('/blogs')
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

@blog.post('/blogs')
def create_blog():
    """
    Create a new blog post.

    Returns:
        JSON: success or error message regarding the blog creation.
    """
    form = CreateBlogForm(request.form)
    
    if current_user.get_number_of_blogs() == 5:
        return jsonify({'message': 'A user is limited to 5 blogs only', 'status': 'error'})

    if not form.validate():
        return jsonify({'message': [field.errors for field in form if field.errors], 'status': 'error'})

    title = form.title.data
    body = form.body.data
    image = request.files.get("image")

    blog = Blog(
        title = title,
        content = body,
        author_id = current_user.id
    )

    db.session.add(blog)
    db.session.commit()

    if image:
        db.session.refresh(blog)
        blog.image = save_picture(
            location="static/blog_pictures",
            image=image,
            image_quality=10,
            as_thumbnail=False
        )
        print(blog)
        db.session.commit()

    return jsonify({'message': 'Blog created successfully', 'status': 'success'})
    
@blog.post('/blogs/<int:blog_id>/like')
@login_required
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

@blog.get('/blog/<int:blog_id>')
@login_required
def get_blog(blog_id):
    """
    Retrieves and displays a specific blog post.

    Args:
        blog_id (int): The ID of the blog post.

    Returns:
        A rendered HTML template displaying the blog post if found, else a 404 error page.
    """
    image_file = url_for('static', filename='profile_pictures/' + current_user.profile_picture)
    blog = Blog.query.get(blog_id)
    author = User.query.get(blog.author_id)

    if blog:
        likes = [like.user_id for like in blog.likes]
        
        blog_data = {
            'id': blog.id,
            'title': blog.title,
            'content': blog.content,
            'image': url_for('static', filename='blog_pictures/' + blog.image) if blog.image else None,
            'date_posted': blog.date_posted.strftime('%B %d, %Y'),
            'time_posted': blog.date_posted.strftime('%I:%M%p'),
            'author': author.username,
            'likes': len(blog.likes),
            'liked_by_user': bool(likes.count(current_user.id))
        }

        return render_template('blog.html', image_file=image_file, user=current_user, blog=blog_data)
    else:
        return render_template('404.html'), 404

@blog.post('/blog/<int:blog_id>/delete')
@login_required
def delete_blog(blog_id):
    """
    Deletes a specific blog post.

    Args:
        blog_id (int): The ID of the blog post.

    Returns:
        A redirection to the home page after deleting the blog post.
    """
    blog = Blog.query.get(blog_id)
    blog.delete()
    db.session.commit()

    return redirect(url_for("index._index")) 

@blog.get('/blog/<int:blog_id>/comments')
@login_required
def get_comments(blog_id):
    """
    Retrieves all comments associated with a specific blog post.

    Args:
        blog_id (int): The ID of the blog post.

    Returns:
        A JSON response containing the comments if found, else an error message and 404 status.
    """
    blog = Blog.query.get(blog_id)
    if blog:
        comments_data = []
        for comment in blog.comments:
            user_comment = ' '.join(comment.text.split()[:15]) if len(comment.text.split()) >= 15 else comment.text
            user = User.query.get(comment.user_id)
            comment_data = {
                'id': comment.id,
                'user_id': comment.user_id,
                'username': user.username,
                'comment': user_comment,
                'date_created': comment.date_posted.strftime('%B %d, %Y'),
                'time_created': comment.date_posted.strftime('%I:%M%p'),
                'profile_picture': url_for('static', filename='profile_pictures/' + user.profile_picture)
            }
            comments_data.append(comment_data)

        return jsonify({'status': 'success', 'comments': comments_data, 'current_user_username' : current_user.username})
    else:
        return jsonify({'status': 'error', 'message': 'Cannot find comments'}), 404

@blog.post('/blogs/<int:blog_id>/comments')
@login_required
def create_comment(blog_id):
    """
    Creates a new comment for a specific blog post.

    Args:
        blog_id (int): The ID of the blog post.

    Returns:
        A JSON response indicating whether the comment creation was successful or not.
    """
    text = request.json.get('text')
    if not text:
        return jsonify({'message': 'Cannot be empty', 'status' : 'error'})

    user = current_user
    
    blog = Blog.query.get(blog_id)

    if blog:
        
        if current_user.get_number_of_comments(blog_id) == 10:
            return jsonify({"status": "error", "message": "A user is limited to 10 comments for a blog"})
        
        comment = Comment(text=text, user_id=user.id, blog_id=blog_id)
        db.session.add(comment)
        db.session.commit()
        
        db.session.refresh(comment)

        comment_data = {
            'id': comment.id,
            'username': user.username,
            'comment': comment.text,
            'date_created': comment.date_posted.strftime('%B %d, %Y'),
            'time_created': comment.date_posted.strftime('%I:%M%p'),
            'profile_picture': url_for('static', filename='profile_pictures/' + user.profile_picture)
        }

        return jsonify({
            'message': 'Comment created successfully',
            'status': 'success',
            'comment': comment_data
        })
    else:
        return jsonify({'message': 'Blog not found', 'status': 'error'}), 404

@blog.post('/blog/comments/<int:comment_id>')
@login_required
def delete_comment(comment_id):
    """
    Deletes a specific comment.

    Args:
        comment_id (int): The ID of the comment.

    Returns:
        A JSON response indicating whether the comment deletion was successful or not.
    """
    comment = Comment.query.get(comment_id)

    if not comment:
        return jsonify({'message': 'Comment not found', 'status': 'error'}), 404
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({'message': 'Comment Deleted', 'status': 'success'})
