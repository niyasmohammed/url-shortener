document.getElementById('generateBtn').addEventListener('click', () => {
    const longUrlInput = document.getElementById('longUrl').value.trim();
    const errorElement = document.getElementById('error');
    const resultCard = document.getElementById('resultCard');
    const shortUrlOutput = document.getElementById('shortUrlOutput');
    const qrContainer = document.getElementById('qrcode');

    errorElement.textContent = '';
    resultCard.style.display = 'none';
    qrContainer.innerHTML = '';

    if (!longUrlInput) {
        errorElement.textContent = 'Please enter a valid URL.';
        return;
    }

    let formattedUrl = longUrlInput;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
    }

    try {
        // Generate a unique ID for local storage
        const uniqueId = Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
        
        // Save mapping in browser's localStorage
        localStorage.setItem(uniqueId, formattedUrl);

        // Build short link pointing to your own GitHub Pages URL with a hash anchor
        const basePageUrl = window.location.href.split('#')[0];
        const shortUrl = `${basePageUrl}#${uniqueId}`;

        // Display output
        shortUrlOutput.href = shortUrl;
        shortUrlOutput.textContent = shortUrl;

        // Generate QR Code locally
        new QRCode(qrContainer, {
            text: shortUrl,
            width: 150,
            height: 150,
        });

        resultCard.style.display = 'block';

        // Download handler
        document.getElementById('downloadBtn').onclick = () => {
            const qrImage = qrContainer.querySelector('img');
            if (qrImage) {
                const link = document.createElement('a');
                link.href = qrImage.src;
                link.download = 'qrcode.png';
                link.click();
            }
        };

    } catch (err) {
        console.error(err);
        errorElement.textContent = 'Something went wrong. Please try again.';
    }
});

// Auto-redirect logic when visiting the short link hash
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
        const originalUrl = localStorage.getItem(hash);
        if (originalUrl) {
            window.location.replace(originalUrl);
        } else {
            document.body.innerHTML = '<div style="text-align:center; margin-top:50px; font-family:sans-serif;"><h2>Link not found or expired!</h2></div>';
        }
    }
});
