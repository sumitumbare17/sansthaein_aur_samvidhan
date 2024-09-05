from flask import Flask, render_template, request, redirect, url_for, session
from firebase import firebase_admin, db
import json

app = Flask(__name__)
app.secret_key = 's8jx8BJCVFidTMoxfsyBznIrZLs6WTBZTZi4fMk4'  # Required to use sessions

@app.route('/home')
def home():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    user_ref = db.reference(f'users/{user_id}')
    user_data = user_ref.get()

    if not user_data:
        return "User data not found", 404

    return render_template('home.html', user=user_data)

@app.route('/article')
def article():
    return render_template('article.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['loginEmail']
        password = request.form['loginPassword']

        # Authenticate the user
        ref = db.reference('users')
        user_query = ref.order_by_child('email').equal_to(email).get()
        if not user_query:
            return "User not found", 400

        user_id, user_data = next(iter(user_query.items()))
        if user_data['password'] != password:
            return "Incorrect password", 400

        # Store the user's ID in the session
        session['user_id'] = user_id

        # User is authenticated
        return redirect(url_for('home'))

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))


@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        full_name = request.form['fullName']
        email = request.form['email']
        mobile = request.form['mobile']
        password = request.form['password']
        birth_date = f"{request.form['day']}-{request.form['month']}-{request.form['year']}"

        # Check if the email is already registered
        ref = db.reference('users')
        if ref.order_by_child('email').equal_to(email).get():
            return "Email already registered", 400

        # Save the user data to Firebase
        new_user_ref = ref.push()
        new_user_ref.set({
            'full_name': full_name,
            'email': email,
            'mobile': mobile,
            'password': password,
            'birth_date': birth_date
        })

        return redirect(url_for('login'))

    return render_template('signup.html')


@app.route('/profile')
def profile():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    user_id = session['user_id']
    user_ref = db.reference(f'users/{user_id}')
    user_data = user_ref.get()

    if not user_data:
        return "User data not found", 404

    return render_template('profile.html', user=user_data)


@app.route('/games')
def games():
    return render_template('games.html')

@app.route('/boardgame')
def boardgame():
    return render_template('boardgame.html')


@app.route('/spin')
def spin():
    return render_template('spin.html')


@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/quizDisplay')
def quizDisplay():
    return render_template('quizDisplay.html')

@app.route('/result')
def result():
    score = request.args.get('score', default=0, type=int)
    return render_template('result.html', score=score)


@app.route('/submit_score', methods=['POST'])
def submit_score():
    # Ensure the user is logged in
    if 'user_id' not in session:
        return json.dumps({'status': 'error', 'message': 'User not logged in'}), 403
    
    # Get the user ID from the session
    user_id = session['user_id']
    data = request.get_json()
    score = data.get('score')
    
    if score is None:
        return json.dumps({'status': 'error', 'message': 'Score not provided'}), 400

    # Update the user's score in Firebase
    user_ref = db.reference(f'users/{user_id}')
    user_ref.update({
        'score': score
    })

    return json.dumps({'status': 'success'}), 200


if __name__ == '__main__':
    app.run(debug=True)