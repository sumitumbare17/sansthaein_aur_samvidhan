import firebase_admin
from firebase_admin import credentials, db

# Path to your Firebase service account key JSON file
cred = credentials.Certificate('Your Key')

# Initialize the app with a service account, granting admin privileges
firebase_admin.initialize_app(cred, {
    'databaseURL': 'Your app link'
})
