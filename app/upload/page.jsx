// "use client";
// import { useState, useRef } from 'react';
// import Head from 'next/head';
// import Link from 'next/link';
// import KMeans from 'kmeans-js';
// import { saveAs } from 'file-saver';

// export default function Upload() {
//     const [imageSrc, setImageSrc] = useState(null);
//     const [colors, setColors] = useState([]);
//     const [numColors, setNumColors] = useState(10);
//     const [fileName, setFileName] = useState('');
//     const fileInputRef = useRef(null);
//     const canvasRef = useRef(null);

//     const handleImageUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
//         setFileName(file.name);
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             setImageSrc(event.target.result);
//             extractColors(event.target.result, numColors);
//         };
//         reader.readAsDataURL(file);
//     };

//     const extractColors = (src, num) => {
//         const img = new window.Image();
//         img.crossOrigin = 'Anonymous';
//         img.onload = () => {
//             const canvas = canvasRef.current;
//             const ctx = canvas.getContext('2d');
//             // Resize image to max 300px for performance
//             let width = img.width;
//             let height = img.height;
//             const maxDimension = 300;
//             if (width > maxDimension || height > maxDimension) {
//                 if (width > height) {
//                     height = Math.round((height * maxDimension) / width);
//                     width = maxDimension;
//                 } else {
//                     width = Math.round((width * maxDimension) / height);
//                     height = maxDimension;
//                 }
//             }
//             canvas.width = width;
//             canvas.height = height;
//             ctx.drawImage(img, 0, 0, width, height);
//             const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
//             const pixels = [];
//             for (let i = 0; i < imageData.length; i += 4) {
//                 pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
//             }

//             const kmeans = new KMeans();
//             kmeans.cluster(pixels, Math.min(num * 3, 50));
//             const centroids = kmeans.centroids.map(c => c.centroid.map(Math.round));
//             const counts = kmeans.clusters.map(cluster => cluster.length);
//             const totalPixels = pixels.length;

//             let colorData = centroids.map((rgb, index) => ({
//                 rgb,
//                 count: counts[index],
//                 percent: (counts[index] / totalPixels) * 100
//             }));

//             colorData = colorData.filter(({ rgb }) => {
//                 const [r, g, b] = rgb;
//                 const sum = r + g + b;
//                 return sum >= 20 && sum <= 760; // Filter near-black/white
//             });

//             const minDistance = 15;
//             const filteredColors = [];
//             for (const color of colorData) {
//                 const [r, g, b] = color.rgb;
//                 let isSimilar = false;
//                 for (const selectedColor of filteredColors) {
//                     const [sr, sg, sb] = selectedColor.rgb;
//                     const distance = Math.sqrt((r - sr) ** 2 + (g - sg) ** 2 + (b - sb) ** 2);
//                     if (distance < minDistance) {
//                         isSimilar = true;
//                         break;
//                     }
//                 }
//                 if (!isSimilar) {
//                     filteredColors.push(color);
//                 }
//                 if (filteredColors.length >= num) break;
//             }

//             const hexColors = filteredColors.slice(0, num).map(color => ({
//                 hex: rgbToHex(color.rgb[0], color.rgb[1], color.rgb[2]),
//                 percent: color.percent.toFixed(2),
//                 rgb: `rgb(${color.rgb[0]}, ${color.rgb[1]}, ${color.rgb[2]})`
//             }));

//             setColors(hexColors);
//         };
//         img.src = src;
//     };

//     const rgbToHex = (r, g, b) => {
//         return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
//     };

//     const copyToClipboard = (text) => {
//         navigator.clipboard.writeText(text).then(() => {
//             const toast = document.createElement('div');
//             toast.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg';
//             toast.textContent = `Copied: ${text}`;
//             document.body.appendChild(toast);
//             setTimeout(() => {
//                 toast.style.opacity = '0';
//                 toast.style.transition = 'opacity 0.5s ease';
//                 setTimeout(() => {
//                     document.body.removeChild(toast);
//                 }, 500);
//             }, 2000);
//         });
//     };

//     const downloadPalette = () => {
//         const csvContent = "Hex,Percentage\n" + colors.map(c => `${c.hex},${c.percent}`).join('\n');
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
//         saveAs(blob, 'palette.csv');
//     };

//     const reset = () => {
//         setImageSrc(null);
//         setColors([]);
//         setFileName('');
//         setNumColors(10);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     return (
//         <div className="min-h-screen text-white flex flex-col gradient-bg">
//             <Head>
//                 <title>Upload - Color Extractor</title>
//             </Head>
//             <nav className="bg-black/20 backdrop-blur-md">
//                 <div className="max-w-6xl mx-auto px-4">
//                     <div className="flex justify-between h-16">
//                         <div className="flex items-center">
//                             <Link href="/" className="flex items-center">
//                                 <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                     <circle cx="12" cy="12" r="10"></circle>
//                                     <circle cx="12" cy="12" r="6"></circle>
//                                     <circle cx="12" cy="12" r="2"></circle>
//                                 </svg>
//                                 <span className="font-bold text-xl">Color Extractor</span>
//                             </Link>
//                         </div>
//                         <div className="flex items-center">
//                             <Link href="/" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Home</Link>
//                             <Link href="/upload" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Upload</Link>
//                         </div>
//                     </div>
//                 </div>
//             </nav>
//             <main className="flex-grow">
//                 {!imageSrc ? (
//                     <div className="max-w-xl mx-auto pt-10 px-4">
//                         <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg">
//                             <h2 className="text-3xl font-bold text-center mb-6">Upload Image</h2>
//                             <div className="space-y-6">
//                                 <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/60 transition-colors">
//                                     <input
//                                         type="file"
//                                         id="image-upload"
//                                         accept="image/*"
//                                         ref={fileInputRef}
//                                         onChange={handleImageUpload}
//                                         className="hidden"
//                                     />
//                                     <label htmlFor="image-upload" className="cursor-pointer">
//                                         <div id="preview-container" className="flex flex-col items-center">
//                                             <svg className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                             </svg>
//                                             <p className="text-white font-medium">Click to select an image</p>
//                                             <p className="text-sm text-white/70 mt-1">or drag and drop</p>
//                                         </div>
//                                     </label>
//                                 </div>
//                                 <div>
//                                     <label className="block text-white font-medium mb-2">Number of colors to extract:</label>
//                                     <div className="flex items-center gap-4">
//                                         <input
//                                             type="range"
//                                             id="num_colors"
//                                             min="1"
//                                             max="20"
//                                             value={numColors}
//                                             onChange={(e) => setNumColors(e.target.value)}
//                                             className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
//                                         />
//                                         <span id="num_colors_display" className="text-white font-medium">{numColors}</span>
//                                     </div>
//                                 </div>
//                                 <button
//                                     onClick={() => fileInputRef.current.click()}
//                                     className="w-full bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg"
//                                 >
//                                     Select Image
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="max-w-6xl mx-auto px-4 py-10">
//                         <div className="mb-6">
//                             <Link href="/" className="flex items-center text-white hover:text-gray-200 font-medium">
//                                 <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                                 </svg>
//                                 Back to Home
//                             </Link>
//                         </div>
//                         <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
//                             <h2 className="text-3xl font-bold mb-6 text-center">Color Analysis</h2>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//                                 <div className="border-2 border-white/20 rounded-lg overflow-hidden shadow-lg">
//                                     <img src={imageSrc} alt="Uploaded Image" className="w-full h-auto object-contain max-h-[400px]" />
//                                 </div>
//                                 <div className="bg-white/5 rounded-lg p-4 flex flex-col justify-center">
//                                     <h3 className="text-xl font-bold mb-4 text-center">Color Palette</h3>
//                                     <div className="flex flex-wrap justify-center gap-2">
//                                         {colors.map((color, index) => (
//                                             <div key={index} className="color-item">
//                                                 <div
//                                                     style={{ backgroundColor: color.hex }}
//                                                     className="w-[50px] h-[50px] rounded-md hover:scale-110 transition-transform shadow-lg cursor-pointer"
//                                                     onClick={() => copyToClipboard(color.hex)}
//                                                 ></div>
//                                                 <p className="text-center text-xs mt-1">{color.percent}%</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex justify-center mb-8">
//                                 <button onClick={downloadPalette} className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg">
//                                     <svg className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
//                                     </svg>
//                                     Download Palette
//                                 </button>
//                             </div>
//                             <div className="overflow-x-auto">
//                                 <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
//                                     <thead>
//                                         <tr className="bg-black/30">
//                                             <th className="p-3 text-left">Preview</th>
//                                             <th className="p-3 text-left">Hex Code</th>
//                                             <th className="p-3 text-left">RGB</th>
//                                             <th className="p-3 text-right">Percentage</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {colors.map((color, index) => (
//                                             <tr key={index} className="bg-white/10 hover:bg-white/20 transition-colors">
//                                                 <td className="p-3">
//                                                     <div style={{ backgroundColor: color.hex }} className="w-10 h-10 rounded shadow-sm"></div>
//                                                 </td>
//                                                 <td className="p-3">
//                                                     <span className="cursor-pointer hover:underline font-mono" onClick={() => copyToClipboard(color.hex)}>
//                                                         {color.hex}
//                                                     </span>
//                                                 </td>
//                                                 <td className="p-3 font-mono">
//                                                     <span className="cursor-pointer hover:underline" onClick={() => copyToClipboard(color.rgb)}>
//                                                         {color.rgb}
//                                                     </span>
//                                                 </td>
//                                                 <td className="p-3 text-right font-medium">{color.percent}%</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                             <div className="flex justify-center mt-8">
//                                 <button
//                                     onClick={reset}
//                                     className="inline-block bg-transparent border-2 border-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold"
//                                 >
//                                     Upload Another Image
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </main>
//             <footer className="py-6 bg-black/20 backdrop-blur-md mt-10">
//                 <div className="max-w-6xl mx-auto px-4 text-center">
//                     <p>Color Extractor - Find the dominant colors in any image</p>
//                     <p className="text-sm mt-2 text-white/70">© 2025 Color Extractor. All rights reserved.</p>
//                 </div>
//             </footer>
//             <canvas ref={canvasRef} className="hidden"></canvas>
//         </div>
//     );
// }

"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import { saveAs } from 'file-saver';

export default function Upload() {
    const [imageSrc, setImageSrc] = useState(null);
    const [previewSrc, setPreviewSrc] = useState(null);
    const [colors, setColors] = useState([]);
    const [numColors, setNumColors] = useState(10);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFileName(file.name);
        setError(null);
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewSrc(event.target.result);
            setImageSrc(event.target.result);
            extractColors(event.target.result, numColors);
        };
        reader.onerror = () => {
            setError('Failed to read the image file.');
            setColors([]);
        };
        reader.readAsDataURL(file);
    };

    const extractColors = (src, num) => {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            try {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                // Resize image to max 300px for performance
                let width = img.width;
                let height = img.height;
                const maxDimension = 300;
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = Math.round((height * maxDimension) / width);
                        width = maxDimension;
                    } else {
                        width = Math.round((width * maxDimension) / height);
                        height = maxDimension;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

                // Sample pixels
                const pixels = [];
                const sampleRate = Math.max(1, Math.floor((width * height) / 10000)); // Sample ~10k pixels
                for (let i = 0; i < imageData.length; i += 4 * sampleRate) {
                    pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
                }

                if (pixels.length === 0) {
                    throw new Error('No pixel data extracted from the image.');
                }

                // Simple color quantization (median cut-like approach)
                const palette = quantizeColors(pixels, num);

                // Count pixels for percentages
                const colorCounts = new Array(palette.length).fill(0);
                pixels.forEach(pixel => {
                    let minDistance = Infinity;
                    let closestIndex = 0;
                    palette.forEach(([pr, pg, pb], index) => {
                        const distance = Math.sqrt(
                            (pixel[0] - pr) ** 2 +
                            (pixel[1] - pg) ** 2 +
                            (pixel[2] - pb) ** 2
                        );
                        if (distance < minDistance) {
                            minDistance = distance;
                            closestIndex = index;
                        }
                    });
                    colorCounts[closestIndex]++;
                });

                const totalPixels = pixels.length;
                const hexColors = palette.map(([r, g, b], index) => ({
                    hex: rgbToHex(r, g, b),
                    percent: ((colorCounts[index] / totalPixels) * 100).toFixed(2),
                    rgb: `rgb(${r}, ${g}, ${b})`
                }));

                // Filter near-black and near-white colors
                const filteredColors = hexColors.filter(color => {
                    const [r, g, b] = color.rgb.match(/\d+/g).map(Number);
                    const sum = r + g + b;
                    return sum >= 20 && sum <= 760;
                });

                setColors(filteredColors.slice(0, num));
            } catch (err) {
                console.error('Error extracting colors:', err);
                setError('Failed to extract colors. Please try another image.');
                setColors([]);
            }
        };
        img.onerror = () => {
            setError('Failed to load the image.');
            setColors([]);
        };
        img.src = src;
    };

    const quantizeColors = (pixels, numColors) => {
        // Simple quantization: bucket pixels into color space and pick centroids
        const buckets = {};
        const step = 32; // Reduce color space to 256/32 = 8 levels per channel
        pixels.forEach(([r, g, b]) => {
            const key = `${Math.floor(r / step) * step},${Math.floor(g / step) * step},${Math.floor(b / step) * step}`;
            if (!buckets[key]) {
                buckets[key] = { count: 0, r: 0, g: 0, b: 0 };
            }
            buckets[key].count++;
            buckets[key].r += r;
            buckets[key].g += g;
            buckets[key].b += b;
        });

        // Sort buckets by count and take top N
        const sortedBuckets = Object.entries(buckets)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, numColors)
            .map(([key, data]) => [
                Math.round(data.r / data.count),
                Math.round(data.g / data.count),
                Math.round(data.b / data.count)
            ]);

        // If fewer colors than requested, fill with random colors
        while (sortedBuckets.length < numColors) {
            sortedBuckets.push([
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255),
                Math.floor(Math.random() * 255)
            ]);
        }

        return sortedBuckets;
    };

    const rgbToHex = (r, g, b) => {
        return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded shadow-lg';
            toast.textContent = `Copied: ${text}`;
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 500);
            }, 2000);
        });
    };

    const downloadPalette = () => {
        const csvContent = "Hex,Percentage\n" + colors.map(c => `${c.hex},${c.percent}`).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'palette.csv');
    };

    const reset = () => {
        setImageSrc(null);
        setPreviewSrc(null);
        setColors([]);
        setFileName('');
        setNumColors(10);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen text-white flex flex-col gradient-bg">
            <title>Upload - Color Extractor</title>
            <nav className="bg-black/20 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <circle cx="12" cy="12" r="6"></circle>
                                    <circle cx="12" cy="12" r="2"></circle>
                                </svg>
                                <span className="font-bold text-xl">Color Extractor</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <Link href="/" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Home</Link>
                            <Link href="/upload" className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">Upload</Link>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow">
                {!imageSrc ? (
                    <div className="max-w-xl mx-auto pt-10 px-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 shadow-lg">
                            <h2 className="text-3xl font-bold text-center mb-6">Upload Image</h2>
                            <div className="space-y-6">
                                <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center hover:border-white/60 transition-colors">
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        {previewSrc ? (
                                            <img src={previewSrc} alt="Preview" className="max-h-60 mx-auto rounded-lg mt-4" />
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <svg className="h-16 w-16 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-white font-medium">Click to select an image</p>
                                                <p className="text-sm text-white/70 mt-1">or drag and drop</p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-white font-medium mb-2">Number of colors to extract:</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            id="num_colors"
                                            min="1"
                                            max="20"
                                            value={numColors}
                                            onChange={(e) => setNumColors(e.target.value)}
                                            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <span className="text-white font-medium">{numColors}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-full bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg"
                                >
                                    Select Image
                                </button>
                            </div>
                            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto px-4 py-10">
                        <div className="mb-6">
                            <Link href="/" className="flex items-center text-white hover:text-gray-200 font-medium">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                            <h2 className="text-3xl font-bold mb-6 text-center">Color Analysis</h2>
                            {error ? (
                                <p className="text-red-500 text-center">{error}</p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        <div className="border-2 border-white/20 rounded-lg overflow-hidden shadow-lg">
                                            <img src={imageSrc} alt="Uploaded Image" className="w-full h-auto object-contain max-h-[400px]" />
                                        </div>
                                        <div className="bg-white/5 rounded-lg p-4 flex flex-col justify-center">
                                            <h3 className="text-xl font-bold mb-4 text-center">Color Palette</h3>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {colors.map((color, index) => (
                                                    <div key={index} className="color-item">
                                                        <div
                                                            style={{ backgroundColor: color.hex }}
                                                            className="w-[50px] h-[50px] rounded-md hover:scale-110 transition-transform shadow-lg cursor-pointer"
                                                            onClick={() => copyToClipboard(color.hex)}
                                                        ></div>
                                                        <p className="text-center text-xs mt-1">{color.percent}%</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center mb-8">
                                        <button onClick={downloadPalette} className="inline-block bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-bold shadow-lg">
                                            <svg className="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download Palette
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                                            <thead>
                                                <tr className="bg-black/30">
                                                    <th className="p-3 text-left">Preview</th>
                                                    <th className="p-3 text-left">Hex Code</th>
                                                    <th className="p-3 text-left">RGB</th>
                                                    <th className="p-3 text-right">Percentage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {colors.map((color, index) => (
                                                    <tr key={index} className="bg-white/10 hover:bg-white/20 transition-colors">
                                                        <td className="p-3">
                                                            <div style={{ backgroundColor: color.hex }} className="w-10 h-10 rounded shadow-sm"></div>
                                                        </td>
                                                        <td className="p-3">
                                                            <span className="cursor-pointer hover:underline font-mono" onClick={() => copyToClipboard(color.hex)}>
                                                                {color.hex}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 font-mono">
                                                            <span className="cursor-pointer hover:underline" onClick={() => copyToClipboard(color.rgb)}>
                                                                {color.rgb}
                                                            </span>
                                                        </td>
                                                        <td className="p-3 text-right font-medium">{color.percent}%</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={reset}
                                    className="inline-block bg-transparent border-2 border-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors font-bold"
                                >
                                    Upload Another Image
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <footer className="py-6 bg-black/20 backdrop-blur-md mt-10">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p>Color Extractor - Find the dominant colors in any image</p>
                    <p className="text-sm mt-2 text-white/70">© 2025 Color Extractor. All rights reserved.</p>
                </div>
            </footer>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
}