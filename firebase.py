import firebase_admin
from firebase_admin import credentials, db

# Path to your Firebase service account key JSON file
cred = credentials.Certificate('static/iotcp-acf25-firebase-adminsdk-5n7bg-92c5cb8ec4.json')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://iotcp-acf25-default-rtdb.asia-southeast1.firebasedatabase.app/'
})
