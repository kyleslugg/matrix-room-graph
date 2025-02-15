# app.py
from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        # Get form data
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        # Here you would typically do something with the data
        # For now, we'll just create a simple response
        return f'Thank you {name}! We received your message: {message}'
    
    # If it's a GET request, show the form
    return render_template('form.html')

if __name__ == '__main__':
    app.run(debug=True)