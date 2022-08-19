import os
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = os.path.expanduser(r'~\Documents\gcp-test-flow.json')
from google.cloud import storage
from flask import Flask, request
from flask_cors import CORS


BUCKET_NANE = 'ms-test-flow'
ORIGIN_HOST = 'http://127.0.0.1:5500'

app = Flask(__name__)
CORS(app)


@app.route('/create-upload-link', methods=['POST'])
def create_upload_link() -> str:
    body = request.get_json()

    storage_client = storage.Client()
    bucket: storage.Bucket = storage_client.bucket(BUCKET_NANE)
    blob: storage.Blob = bucket.blob(body['name'])

    session_uri = blob.create_resumable_upload_session(
        content_type=body['type'],
        size=body['size'],
        origin=ORIGIN_HOST,
    )

    return session_uri


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
