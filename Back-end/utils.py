from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models import db, User, DismissedPod

# Initialize Bcrypt without the Flask app, to be initialized later
bcrypt = Bcrypt()


def init_app(app):
    bcrypt.init_app(app)


def hash_password(password):
    return bcrypt.generate_password_hash(password).decode('utf-8')


def add_user(username, hashed_password, **extra_fields):
    new_user = User(username=username,
                    password_hash=hashed_password, **extra_fields)
    db.session.add(new_user)
    try:
        db.session.commit()
        return new_user
    except Exception as e:
        db.session.rollback()
        raise e  # Raising the exception to be handled by the caller

def createUser(username, password, **extra_fields):
    hashed_password = hash_password(password)
    return add_user(username, hashed_password, **extra_fields)

def loginUser(username, password):
    user = find_user_by_username(username)
    if user and bcrypt.check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.user_id)
        # user.user_id => user_id from the database
        return {"access_token": access_token, "user_id": user.user_id}
    else:
        return None


def find_user_by_username(username):
    return User.query.filter_by(username=username).first()


def check_password_hash(password_hash, password):
    return bcrypt.check_password_hash(password_hash, password)


def generate_access_token(user_id):
    return create_access_token(identity=user_id)

# Membership Management


def join_pod(user, pod):
    if user not in pod.users:
        pod.users.append(user)
        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e  # Raising the exception to be handled by the caller
    return False


def leave_pod(user, pod):
    if user in pod.users:
        pod.users.remove(user)
        try:
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            raise e  # Raising the exception to be handled by the caller
    return False

# Dismissed Pod Management


def dismiss_pod(user_id, pod_id):
    dismissed_pod = DismissedPod(user_id=user_id, pod_id=pod_id)
    db.session.add(dismissed_pod)
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise e  # Raising the exception to be handled by the caller


def undismiss_pod(dismissed_pod):
    db.session.delete(dismissed_pod)
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise e  # Raising the exception to be handled by the caller
