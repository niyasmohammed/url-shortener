document.getElementById('generateBtn').addEventListener('click', async () => {
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

    // Ensure URL has http:// or https://
    let formattedUrl = longUrlInput;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = 'https://' + formattedUrl;
    }

    try {
        // Using a reliable public CORS proxy/API alternative for client-side generation
        const apiResponse = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(formattedUrl)}`, {
            method: 'GET',
            mode: 'cors'
        });

        if (!apiResponse.ok) throw new Error('Network response was not ok');

        const shortUrl = await apiResponse.text();

        if (!shortUrl.startsWith('http')) {
            throw new Error('Invalid response from shortener service');
        }

        // Display the short URL
        shortUrlOutput.href = shortUrl;
        shortUrlOutput.textContent = shortUrl;

        // Generate QR code for the short URL
        new QRCode(qrContainer, {
            text: shortUrl,
            width: 150,
            height: 150,
        });

        resultCard.style.display = 'block';

        // Setup download button
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

        // Fallback: If browser blocks the API via CORS, generate a QR code directly from a fallback free encoder API
        try {
            const fallbackShortUrl = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(formattedUrl)}`;
            const res = await fetch(fallbackShortUrl);
            const shortUrl = await res.text();

            if (shortUrl.startsWith('http')) {
                shortUrlOutput.href = shortUrl;
                shortUrlOutput.textContent = shortUrl;

                new QRCode(qrContainer, {
                    text: shortUrl,
                    width: 150,
                    height: 150,
                });

                resultCard.style.display = 'block';

                document.getElementById('downloadBtn').onclick = () => {
                    const qrImage = qrContainer.querySelector('img');
                    if (qrImage) {
                        const link = document.createElement('a');
                        link.href = qrImage.src;
                        link.download = 'qrcode.png';
                        link.click();
                    }
                };
                return;
            }
        } catch (fallbackErr) {
            console.error(fallbackErr);
        }

        errorElement.textContent = 'Failed to generate short URL. Please check your network or try a different link.';
    }
});
