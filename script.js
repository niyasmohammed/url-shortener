document.getElementById('generateBtn').addEventListener('click', async () => {
    const longUrl = document.getElementById('longUrl').value.trim();
    const errorElement = document.getElementById('error');
    const resultCard = document.getElementById('resultCard');
    const shortUrlOutput = document.getElementById('shortUrlOutput');
    const qrContainer = document.getElementById('qrcode');

    errorElement.textContent = '';
    resultCard.style.display = 'none';
    qrContainer.innerHTML = '';

    if (!longUrl) {
        errorElement.textContent = 'Please enter a valid URL.';
        return;
    }

    try {
        // Using TinyURL free public API to shorten links without a backend server
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (!response.ok) throw new Error('Failed to shorten URL');

        const shortUrl = await response.text();

        // Display short URL
        shortUrlOutput.href = shortUrl;
        shortUrlOutput.textContent = shortUrl;

        // Generate QR Code dynamically using qrcode.js
        new QRCode(qrContainer, {
            text: shortUrl,
            width: 150,
            height: 150,
        });

        resultCard.style.display = 'block';

        // Download handler for QR code
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
