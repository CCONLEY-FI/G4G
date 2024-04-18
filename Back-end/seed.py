from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import User, Pod, UserPod, DismissedPod, db

# Create the database engine
engine = create_engine('sqlite:///instance/app.db')

# Create the tables
db.metadata.create_all(engine)

# Create a session
Session = sessionmaker(bind=engine)
session = Session()

# Define the initial user data
user_data = [
    {
        'username': 'user1',
        'password_hash': 'hashed_password1',
        'image_url': 'https://example.com/user1.jpg',
        'discord': 'user1#1234',
        'email': 'user1@example.com',
        'steam': 'user1'
    },
    {
        'username': 'user2',
        'password_hash': 'hashed_password2',
        'image_url': 'https://example.com/user2.jpg',
        'discord': 'user2#5678',
        'email': 'user2@example.com',
        'steam': 'user2'
    },
    {
        'username': 'user3',
        'password_hash': 'hashed_password3',
        'image_url': 'https://example.com/user3.jpg',
        'discord': 'user3#9012',
        'email': 'user3@example.com',
        'steam': 'user3'
    }
]

# Create the users and add them to the session
for user_info in user_data:
    user = User(**user_info)
    session.add(user)
    print(f"Added user: {user.username}")

# Define the initial pod data
pod_data = [
    {
        'pod_name': 'Gaming Pod',
        'image_url': 'https://example.com/gaming-pod.jpg',
        'discord': 'gaming-pod#1234',
        'email': 'gaming-pod@example.com',
        'steam': 'gaming-pod',
        'max_capacity': 10
    },
    {
        'pod_name': 'Art Pod',
        'image_url': 'https://example.com/art-pod.jpg',
        'discord': 'art-pod#5678',
        'email': 'art-pod@example.com',
        'max_capacity': 8
    },
    {
        'pod_name': 'Music Pod',
        'image_url': 'https://example.com/music-pod.jpg',
        'discord': 'music-pod#9012',
        'email': 'music-pod@example.com',
        'steam': 'music-pod',
        'max_capacity': 12
    }
]

# Create the pods and add them to the session
for pod_info in pod_data:
    pod = Pod(**pod_info)
    session.add(pod)
    print(f"Added pod: {pod.pod_name}")

# Create the UserPod and DismissedPod associations
user1 = session.query(User).filter_by(username='user1').first()
user2 = session.query(User).filter_by(username='user2').first()
user3 = session.query(User).filter_by(username='user3').first()

gaming_pod = session.query(Pod).filter_by(pod_name='Gaming Pod').first()
art_pod = session.query(Pod).filter_by(pod_name='Art Pod').first()
music_pod = session.query(Pod).filter_by(pod_name='Music Pod').first()

user_pod1 = UserPod(user=user1, pod=gaming_pod, is_owner=True)
user_pod2 = UserPod(user=user2, pod=art_pod, is_owner=True)
user_pod3 = UserPod(user=user3, pod=music_pod, is_owner=True)

dismissed_pod1 = DismissedPod(user_id=user1.user_id, pod_id=art_pod.pod_id)
dismissed_pod2 = DismissedPod(user_id=user2.user_id, pod_id=music_pod.pod_id)

session.add_all([user_pod1, user_pod2, user_pod3,
                dismissed_pod1, dismissed_pod2])
print("Added user-pod and dismissed-pod associations")

# Commit the changes and close the session
try:
    session.commit()
    print("Changes committed successfully.")
except Exception as e:
    print(f"Error committing changes: {e}")
finally:
    session.close()
