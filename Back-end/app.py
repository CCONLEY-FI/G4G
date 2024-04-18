import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from sqlalchemy import func
from models import User, Pod, DismissedPod, UserPod, db
from utils import createUser, find_user_by_username, loginUser, init_app

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get(
    'JWT_SECRET_KEY', 'suspicious_string')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

db.init_app(app)
jwt = JWTManager(app)
CORS(app)

init_app(app)


def update_user_image_url(user_id, image_url):
    user = User.query.get(user_id)
    user.image_url = image_url
    db.session.commit()
    return user


def update_pod_image_url(pod_id, image_url):
    pod = Pod.query.get(pod_id)
    pod.image_url = image_url
    db.session.commit()
    return pod


# User operations
@app.route('/profile/<int:user_id>/image', methods=['PATCH'])
@jwt_required()
def update_user_image(user_id):
    image_url = request.json.get('image_url')
    if not image_url:
        return jsonify({'message': 'Image URL is required'}), 400
    update_user_image_url(user_id, image_url)
    return jsonify({'message': 'Image URL updated successfully'}), 200


@app.route('/pods/<int:pod_id>/image', methods=['PATCH'])
def update_pod_image(pod_id):
    image_url = request.json.get('image_url')
    if not image_url:
        return jsonify({'message': 'No image URL provided'}), 400

    update_pod_image_url(pod_id, image_url)
    return jsonify({'message': 'Pod image URL updated successfully'}), 200


@app.route('/profile/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'image_url': user.image_url,
        'discord': user.discord,
        'email': user.email,
        'steam': user.steam,
        'tags': [tag.tag_name for tag in user.tags]
    }), 200

# @app.route('/user/<int:user_id>', methods=['GET'])
# def get_user(user_id):
#     user = User.query.get_or_404(user_id)
#     return jsonify({'user_id': user.id, 'username': user.username}), 200

# Pod operations


@app.route('/pod/<int:pod_id>', methods=['GET'])
def get_pod(pod_id):
    pod = Pod.query.get_or_404(pod_id)
    return jsonify({
        'pod_id': pod.id,
        'pod_name': pod.pod_name,
        'image_url': pod.image_url,
        'discord': pod.discord,
        'email': pod.email,
        'steam': pod.steam,
        'max_capacity': pod.max_capacity
    }), 200

# Auth Routes


@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    if find_user_by_username(username):
        return jsonify({'message': 'User already exists!'}), 409
    try:
        new_user = createUser(username, password)
        return jsonify(message='User created successfully', user_id=new_user.id), 201
    except Exception as e:
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400

    result = loginUser(username, password)
    if result:
        # Return both access_token and user_id to the client
        return jsonify(access_token=result["access_token"], user_id=result["user_id"]), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/profile/<int:user_id>', methods=['PATCH'])
@jwt_required()
def update_user_profile(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Access is forbidden'}), 403

    user = User.query.get_or_404(user_id)
    data = request.json
    # Update basic fields
    user.username = data.get('username', user.username)
    user.email = data.get('email', user.email)
    user.discord = data.get('discord', user.discord)
    user.steam = data.get('steam', user.steam)
    user.image_url = data.get('image_url', user.image_url)
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/profile/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user_profile(user_id):
    current_user_id = get_jwt_identity()
    if current_user_id != user_id:
        return jsonify({'message': 'Access is forbidden'}), 403

    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

# @app.route('/user/<int:user_id>/tags', methods=['POST'])
# @jwt_required()
# def add_user_tag(user_id):
#     current_user_id = get_jwt_identity()
#     if current_user_id != user_id:
#         return jsonify({'message': 'Access is forbidden'}), 403

#     data = request.json
#     tag_id = data.get('tag_id')

#     if not tag_id:
#         return jsonify({'message': 'Tag ID is required'}), 400

#     # Check if the tag exists
#     tag = Tag.query.get(tag_id)
#     if not tag:
#         return jsonify({'message': 'Tag does not exist'}), 404

#     # Check if the user already has this tag associated
#     existing_user_tag = UserTag.query.filter_by(
#         user_id=user_id, tag_id=tag_id).first()
#     if existing_user_tag:
#         return jsonify({'message': 'User already has this tag associated'}), 200

#     try:
#         new_user_tag = UserTag(user_id=user_id, tag_id=tag_id)
#         db.session.add(new_user_tag)
#         db.session.commit()
#         return jsonify({'message': 'Tag added to user successfully'}), 201
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'An error occurred', 'error': str(e)}), 500

# @app.route('/user_tags/<int:tag_id>/toggle', methods=['POST'])
# @jwt_required()
# def toggle_tag_include(tag_id):
#     user_id = get_jwt_identity()
#     user_tag = UserTag.query.filter_by(user_id=user_id, tag_id=tag_id).first()
#     if user_tag:
#         user_tag.is_included = not user_tag.is_included
#         db.session.commit()
#         return jsonify({'message': 'Tag include status toggled'}), 200
#     return jsonify({'message': 'Tag not found'}), 404

# Pod Routes


@app.route('/pods', methods=['POST'])
@jwt_required()
def create_pod():
    data = request.json
    required_fields = ['pod_name', 'max_capacity']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({'message': f'Missing fields: {", ".join(missing_fields)}'}), 400

    try:
        max_capacity = int(data['max_capacity'])
        if max_capacity <= 0:
            raise ValueError("max_capacity must be a positive integer")
    except ValueError as e:
        return jsonify({'message': str(e)}), 400

    if Pod.query.filter_by(pod_name=data['pod_name']).first():
        return jsonify({'message': 'Pod already exists'}), 409

    try:
        new_pod = Pod(
            pod_name=data['pod_name'],
            image_url=data.get('image_url', ''),
            discord=data.get('discord', ''),
            email=data.get('email', ''),
            steam=data.get('steam', ''),
            max_capacity=max_capacity,
            tags=data.get('tags', [])
        )
        db.session.add(new_pod)
        db.session.flush()

        current_user_id = get_jwt_identity()
        user_pod = UserPod(user_id=current_user_id,
                           pod_id=new_pod.id, is_owner=True)
        db.session.add(user_pod)

        db.session.commit()
        return jsonify({'message': 'Pod created successfully', 'pod_id': new_pod.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred while creating the pod', 'error': str(e)}), 500


@app.route('/pods/<int:pod_id>', methods=['GET'])
@jwt_required()
def get_pod_details(pod_id):
    pod = Pod.query.get_or_404(pod_id)
    pod_data = {
        'pod_id': pod.id,
        'pod_name': pod.pod_name,
        'image_url': pod.image_url,
        'discord': pod.discord,
        'email': pod.email,
        'steam': pod.steam,
        'max_capacity': pod.max_capacity,
        'users': [
            {
                'user_id': user_pod.user.id,
                'username': user_pod.user.username,
                'is_owner': user_pod.is_owner
            }
            for user_pod in pod.user_pods
        ]
    }
    return jsonify(pod_data), 200


@app.route('/pods/<int:pod_id>', methods=['PATCH'])
@jwt_required()
def update_pod(pod_id):
    current_user_id = get_jwt_identity()
    user_pod = UserPod.query.filter_by(
        user_id=current_user_id, pod_id=pod_id).first()
    if not user_pod or not user_pod.is_owner:
        return jsonify({'message': 'You are not authorized to update this pod'}), 403

    pod = Pod.query.get_or_404(pod_id)
    data = request.json

    for field in ['pod_name', 'image_url', 'discord', 'email', 'steam', 'max_capacity']:
        if field in data:
            setattr(pod, field, data[field])

    if 'tags' in data:
        pod.tags = data['tags']

    db.session.commit()
    return jsonify({'message': 'Pod updated successfully'}), 200

@app.route('/pods/<int:pod_id>', methods=['DELETE'])
@jwt_required()
def delete_pod(pod_id):
    current_user_id = get_jwt_identity()
    user_pod = UserPod.query.filter_by(
        user_id=current_user_id, pod_id=pod_id).first()
    if not user_pod or not user_pod.is_owner:
        return jsonify({'message': 'You are not authorized to delete this pod'}), 403

    pod = Pod.query.get_or_404(pod_id)
    db.session.delete(pod)
    db.session.commit()
    return jsonify({'message': 'Pod deleted successfully'}), 200

@app.route('/pods/<int:pod_id>/users', methods=['PATCH'])
@jwt_required()
def adjust_pod_users(pod_id):
    current_user_id = get_jwt_identity()
    user_pod = UserPod.query.filter_by(
        user_id=current_user_id, pod_id=pod_id).first()
    if not user_pod or not user_pod.is_owner:
        return jsonify({'message': 'You are not authorized to adjust users in this pod'}), 403

    pod = Pod.query.get_or_404(pod_id)
    data = request.json

    if 'add_users' in data:
        for user_id in data['add_users']:
            user = User.query.get(user_id)
            if user and user not in pod.users:
                pod.users.append(user)

    if 'remove_users' in data:
        for user_id in data['remove_users']:
            user = User.query.get(user_id)
            if user in pod.users:
                pod.users.remove(user)

    db.session.commit()
    return jsonify({'message': 'Pod users updated successfully'}), 200

@app.route('/pods/<int:pod_id>/join', methods=['POST'])
@jwt_required()
def join_pod(pod_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    pod = Pod.query.get(pod_id)

    if not pod:
        return jsonify({'message': 'Pod not found'}), 404

    if user in pod.users:
        return jsonify({'message': 'User already in pod'}), 400

    if len(pod.users) >= pod.max_capacity:
        return jsonify({'message': 'Pod is at max capacity'}), 400

    try:
        pod.users.append(user)
        db.session.commit()
        return jsonify({'message': 'User joined pod successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred while joining the pod', 'error': str(e)}), 500

# @app.route('/pods/<int:pod_id>/leave', methods=['POST'])
# @jwt_required()
# def leave_pod(pod_id):
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)
#     pod = Pod.query.get(pod_id)

#     if not pod:
#         return jsonify({'message': 'Pod not found'}), 404

#     if user not in pod.users:
#         return jsonify({'message': 'User not in pod'}), 400

#     try:
#         pod.users.remove(user)
#         db.session.commit()
#         return jsonify({'message': 'User left pod successfully'}), 200
#     except Exception as e:
#         db.session.rollback()
#         return jsonify({'message': 'An error occurred while leaving the pod', 'error': str(e)}), 500

# @app.route('/pod/<int:pod_id>/tags', methods=['POST'])
# @jwt_required()
# def add_tag_to_pod(pod_id):
#     current_user_id = get_jwt_identity()
#     # Check if the current user is the owner of the pod
#     user_pod = UserPod.query.filter_by(
#         user_id=current_user_id, pod_id=pod_id).first()
#     if not user_pod or not user_pod.is_owner:
#         return jsonify({'message': 'You are not authorized to add tags to this pod'}), 403

#     data = request.json
#     tag_id = data.get('tag_id')
#     if not tag_id:
#         return jsonify({'message': 'Tag ID is required'}), 400
#     tag = Tag.query.get(tag_id)
#     if not tag:
#         return jsonify({'message': 'Tag does not exist'}), 404
#     pod_tag = PodTag(pod_id=pod_id, tag_id=tag_id)
#     db.session.add(pod_tag)
#     db.session.commit()
#     return jsonify({'message': 'Tag added to pod successfully'}), 201

#Tag management routes

# @app.route('/tags', methods=['GET'])
# @jwt_required()
# def get_tags():
#     tags = Tag.query.all()
#     tags_data = [{'tag_id': tag.tag_id, 'tag_name': tag.tag_name}
#                  for tag in tags]
#     return jsonify(tags_data), 200


# @app.route('/tags', methods=['POST'])
# @jwt_required()
# def create_tag():
#     data = request.json
#     tag_name = data.get('tag_name')
#     if not tag_name:
#         return jsonify({'message': 'Tag name is required'}), 400
#     if Tag.query.filter_by(tag_name=tag_name).first():
#         return jsonify({'message': 'Tag already exists'}), 409
#     tag = Tag(tag_name=tag_name)
#     db.session.add(tag)
#     db.session.commit()
#     return jsonify({'message': 'Tag created successfully', 'tag_id': tag.tag_id}), 201

# @app.route('/tags/<int:tag_id>', methods=['DELETE'])
# @jwt_required()
# def delete_tag(tag_id):
#     tag = Tag.query.get_or_404(tag_id)
#     db.session.delete(tag)
#     db.session.commit()
#     return jsonify({'message': 'Tag deleted successfully'}), 200

# Swipe Routes


@app.route('/get_pod_for_swipe', methods=['GET'])
@jwt_required()
def get_pod_for_swipe():
    user_id = get_jwt_identity()

    # Retrieve candidate pods not dismissed by the user and with capacity
    candidate_pods = Pod.query \
        .outerjoin(UserPod, Pod.pod_id == UserPod.pod_id) \
        .group_by(Pod.pod_id) \
        .having(func.count(UserPod.user_id) < Pod.max_capacity) \
        .filter(Pod.pod_id.notin_(db.session.query(DismissedPod.pod_id).filter(DismissedPod.user_id == user_id))) \
        .all()

    if candidate_pods:
        selected_pod = candidate_pods[0]  # Select the first candidate pod
        return jsonify({'pod_id': selected_pod.pod_id, 'pod_name': selected_pod.pod_name}), 200
    else:
        return jsonify({'message': 'No suitable pods found'}), 404

@app.route('/users/search', methods=['GET'])
def search_users():
    query = request.args.get('query')
    if not query:
        return jsonify({'message': 'Query is required'}), 400
    users = User.query.filter(User.username.ilike(f'%{query}%')).all()
    users_data = [{'user_id': user.user_id, 'username': user.username}
                  for user in users]
    return jsonify(users_data), 200

# Dissmissed Pod Routes
@app.route('/dismissed_pod/<int:pod_id>', methods=['POST', 'DELETE'])
@jwt_required()
def dismissed_pod(pod_id):
    user_id = get_jwt_identity()
    dismissed_pod = DismissedPod.query.filter_by(
        user_id=user_id, pod_id=pod_id).first()

    try:
        if request.method == 'POST':
            if dismissed_pod:
                return jsonify({'message': 'Pod already dismissed'}), 400
            new_dismissed_pod = DismissedPod(user_id=user_id, pod_id=pod_id)
            db.session.add(new_dismissed_pod)
            db.session.commit()
            return jsonify({'message': 'Pod dismissed successfully'}), 201

        elif request.method == 'DELETE':
            if not dismissed_pod:
                return jsonify({'message': 'Pod not found in dismissed list'}), 404
            db.session.delete(dismissed_pod)
            db.session.commit()
            return jsonify({'message': 'Pod removed from dismissed list'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred', 'error': str(e)}), 500


def init_db():
    with app.app_context():
        db.create_all()
        print("Database initialized.")


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
