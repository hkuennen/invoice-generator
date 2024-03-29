import json
from flask import Flask, request, send_file
from pdf_generation.create import PDFCreator

app = Flask(__name__, static_folder='../build', static_url_path='/')

@app.route('/api/data', methods = ['GET', 'POST'])
def index():
  if request.method == "POST":
    data = json.loads(request.data)
    pdf = PDFCreator(data)
    buffer = pdf.create_pdf()
    buffer.seek(0)
    return send_file(buffer, mimetype='application/pdf', download_name='Invoice.pdf', as_attachment=True)
  
@app.route('/')
def serve():
  return app.send_static_file('index.html')
