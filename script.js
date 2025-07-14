const uploadBox = document.getElementById('uploadBox');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const previewArea = document.getElementById('previewArea');
const previewImg = document.getElementById('previewImg');
const removeBgBtn = document.getElementById('removeBgBtn');
const resetBtn = document.getElementById('resetBtn');
const resultArea = document.getElementById('resultArea');
const resultImg = document.getElementById('resultImg');
const downloadBtn = document.getElementById('downloadBtn');

let uploadedFile = null;

uploadBox.addEventListener('click', () => fileInput.click());
browseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
});
uploadBox.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
});
uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
    }
});
fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
    }
    uploadedFile = file;
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewArea.style.display = 'block';
        uploadBox.style.display = 'none';
        resultArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

removeBgBtn.addEventListener('click', () => {
    if (!uploadedFile) return;
    removeBgBtn.disabled = true;
    removeBgBtn.textContent = 'Processing...';

    // Real Clipdrop API call (direct, will only work if CORS is allowed)
    const formData = new FormData();
    formData.append('image_file', uploadedFile);

    fetch('https://clipdrop-api.co/remove-background/v1', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer XxOjtq8u4Ab3omHzx5ktA8SGKyP2'
        },
        body: formData
    })
    .then(res => {
        if (!res.ok) throw new Error('API Error: ' + res.status);
        return res.blob();
    })
    .then(blob => {
        const url = URL.createObjectURL(blob);
        resultImg.src = url;
        resultArea.style.display = 'block';
        previewArea.style.display = 'none';
        downloadBtn.href = url;
        removeBgBtn.disabled = false;
        removeBgBtn.textContent = 'Remove Background';
    })
    .catch(err => {
        alert('Background removal failed! ' + err.message);
        removeBgBtn.disabled = false;
        removeBgBtn.textContent = 'Remove Background';
    });
});

resetBtn.addEventListener('click', () => {
    uploadedFile = null;
    previewImg.src = '';
    previewArea.style.display = 'none';
    uploadBox.style.display = 'block';
    resultArea.style.display = 'none';
}); 