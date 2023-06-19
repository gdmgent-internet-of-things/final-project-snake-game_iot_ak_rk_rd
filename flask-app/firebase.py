import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Path to the service account key JSON file
cred = credentials.Certificate('./snake-game-48a68-firebase-adminsdk-vqv8q-aa933bd31d.json')
firebase_admin.initialize_app(cred)

# Get a Firestore client
db = firestore.client()
