// Defines
API_URL = 'http://127.0.0.1:5000'
const fileElement = document.getElementById('file');


async function uploadGCS(inputFile) {
  const payload = {
    name: inputFile.name,
    size: inputFile.size,
    type: inputFile.type
  }

  const response = await fetch(
    `${API_URL}/create-upload-link`,
    {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    console.warn(response);
    return;
  }

  const sessionURI = await response.text();
  const uploadResult = await fetch(
    sessionURI,
    {
      method: 'PUT',
      body: inputFile,
      headers: {
        'Content-Length': inputFile.size
      }
    }
  );
  console.log(uploadResult.status);
  console.log(uploadResult);
}


// Callbacks
fileElement.addEventListener('change', () => {
  const inputFiles = fileElement.files;
  if (inputFiles.length === 0) return;

  const inputFile = inputFiles[0];
  uploadGCS(inputFile);
});
