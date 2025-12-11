from flask import Flask, request, jsonify
import time

# Optional Fallback Server
# Usage: python fallback-server-snippet.py
# Dependencies: flask, (and your python llama binding, e.g. llama-cpp-python)

app = Flask(__name__)

# Mock generation
@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    prompt = data.get('prompt', '')
    
    print(f"Received prompt: {prompt}")
    
    def generate_tokens():
        # TODO: Hook up real Python Llama here
        response = "This is a fallback response from the Python server."
        for word in response.split():
            yield word + " "
            time.sleep(0.1)
            
    return jsonify({
        "status": "success", 
        "text": "This is a fallback response from the Python server."
    })

if __name__ == '__main__':
    print("Starting fallback server on port 5000...")
    app.run(port=5000, debug=True)
