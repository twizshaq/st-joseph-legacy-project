// lib/qrGenerator.js
const QRCode = require('qrcode');

/**
 * Generates a branded SVG QR code string.
 * @param {string} data - The data/URL to encode.
 * @returns {Promise<string>} - The raw SVG string.
 */
const generateTicketQR = async (data) => {
    try {
        // 1. Generate raw QR data (the matrix of 0s and 1s)
        const qrData = await QRCode.create(data, { errorCorrectionLevel: 'H' });
        const modules = qrData.modules;
        const size = modules.size;
        
        // 2. Your Design Settings
        const color = "#007BFF"; // Your specific blue
        const bgColor = "#ffffff";
        const moduleSize = 10;   // Size of the dots
        const margin = 4;        // White spacing
        
        // Calculate total SVG size
        const totalSize = (size + margin * 2) * moduleSize;
        
        // 3. Start building the SVG string
        let svg = `<svg width="500" height="500" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">`;
        
        // Add the white background with rounded corners (matches your outer rect)
        svg += `<rect fill="${bgColor}" width="${totalSize}" height="${totalSize}" rx="40" ry="40" />`;

        // 4. Loop through the QR matrix to draw the dots
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                // If the module is dark (1), draw it
                if (modules.data[r * size + c]) {
                    const x = (c + margin) * moduleSize;
                    const y = (r + margin) * moduleSize;
                    
                    // Draw the blue rounded square
                    // rx/ry controls the roundness of the individual dots
                    svg += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${color}" rx="3" ry="3" />`;
                }
            }
        }

        svg += `</svg>`;
        return svg;

    } catch (err) {
        console.error("Error generating QR:", err);
        throw err;
    }
};

module.exports = { generateTicketQR };