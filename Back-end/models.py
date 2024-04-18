from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    discord = db.Column(db.String(100), nullable=True)
    email = db.Column(db.String(100), nullable=True)
    steam = db.Column(db.String(50), nullable=True)
    pods = db.relationship('UserPod', backref='user',
                           lazy=True, cascade='all, delete-orphan')
    dismissed_pods = db.relationship(
        'DismissedPod', backref='user', lazy=True, cascade='all, delete-orphan')


class Pod(db.Model):
    pod_id = db.Column(db.Integer, primary_key=True)
    pod_name = db.Column(db.String(50), nullable=False, unique=True)
    image_url = db.Column(db.String(255))
    discord = db.Column(db.String(100))
    email = db.Column(db.String(100))
    steam = db.Column(db.String(50))
    max_capacity = db.Column(db.Integer, nullable=False)
    users = db.relationship('UserPod', backref='pod',
                            lazy=True, cascade='all, delete-orphan')


class UserPod(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.user_id'), primary_key=True)
    pod_id = db.Column(db.Integer, db.ForeignKey(
        'pod.pod_id'), primary_key=True)
    is_owner = db.Column(db.Boolean, default=False)


class DismissedPod(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey(
        'user.user_id'), primary_key=True)
    pod_id = db.Column(db.Integer, db.ForeignKey(
        'pod.pod_id'), primary_key=True)


# deprecated codebase-------------


# class Tag(db.Model):
#     tag_id = db.Column(db.Integer, primary_key=True)
#     tag_name = db.Column(db.String(50), unique=True, nullable=False)

# association tables
# class UserTag(db.Model):
#     user_id = db.Column(db.Integer, db.ForeignKey(
#         'user.user_id'), primary_key=True)
#     tag_id = db.Column(db.Integer, db.ForeignKey(
#         'tag.tag_id'), primary_key=True)
#     is_included = db.Column(db.Boolean, default=True)

# class PodTag(db.Model):
#     pod_id = db.Column(db.Integer, db.ForeignKey(
#         'pod.pod_id'), primary_key=True)
#     tag_id = db.Column(db.Integer, db.ForeignKey(
#         'tag.tag_id'), primary_key=True)