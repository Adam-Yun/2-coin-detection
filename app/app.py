# from flask import Flask, request, jsonify
# from flask_cors import CORS

# # Packages for image rendering
# import json
# import base64
# from PIL import Image
# from io import BytesIO

# app = Flask(__name__)
# CORS(app)

# # POST to get the trained data, which are the plot points 
# @app.route('/printHelloWorld', methods=['POST'])
# def print_hello_world():
#     data = request.get_json()
#     print(f"Received data: {data}")  # Print received data

#     data = json.loads(data)
#     image_data_base64 = data['Data']

#     # Step 2: Decode the base64 image data
#     image_data = base64.b64decode(image_data_base64)

#     # Step 3: Convert the decoded data to an image
#     image = Image.open(BytesIO(image_data))

#     # Display or save the image
#     # image.show()  # To display the image
#     image.save('output_image.png')  # To save the image

#     return jsonify({'Data': 'Hello From PYTHON'})

# # Run the server
# if __name__ == '__main__':
#     print("Starting Flask server on port 8000")
#     app.run(debug=True, host='0.0.0.0', port=8000)


from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename

import base64, os
from PIL import Image
from io import BytesIO

app = Flask(__name__)
CORS(app)

@app.route('/connectionCheck', methods=['POST'])
def connection_check():
    try:
        return jsonify({'Data': 'Connection Establish'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Ensure the upload folder exists
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()

    image_data = data.get('image_data')

    # Decode base64 string to bytes
    image_bytes = base64.b64decode(image_data.split(',')[1])

    # Create an Image object from the decoded bytes
    image = Image.open(BytesIO(image_bytes))

    # Generate a unique filename
    filename = os.path.join(UPLOAD_FOLDER, 'uploaded_image.jpg')

    # Save the image
    image.save(filename)

    return jsonify({'message': 'Image received and saved successfully'})


if __name__ == '__main__':
    print("Starting Flask server on port 8000")
    app.run(debug=True, host='0.0.0.0', port=8000)
