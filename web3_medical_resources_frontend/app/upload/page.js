'use client';

// import React, { useState } from 'react';

// const PinataUpload = () => {
//     const [file, setFile] = useState(null);
//     const [uploading, setUploading] = useState(false);
//     const [result, setResult] = useState(null);
//     const [error, setError] = useState(null);

//     const handleFileChange = (e) => {
//         setFile(e.target.files[0]);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!file) {
//           setError('Please select a file');
//           return;
//         }
      
//         setUploading(true);
//         setError(null);
//         setResult(null);
      
//         const formData = new FormData();
//         formData.append('file', file);
      
//         try {
//           const response = await fetch('/api/uploadPinata', {
//             method: 'POST',
//             body: formData,
//           });
      
//           // Log the raw response for debugging
//           const text = await response.text();
//           console.log('Raw response:', text);
      
//           // Attempt to parse the response as JSON
//           const data = JSON.parse(text);
      
//           if (!response.ok) {
//             throw new Error(data.error || 'Upload failed');
//           }
      
//           setResult(data);
//         } catch (err) {
//           console.error('Error uploading file:', err);
//           setError('Error uploading file: ' + (err.message || 'Unknown error'));
//         } finally {
//           setUploading(false);
//         }
//       };
      

//     return (
//         <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
//             <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Upload File to Pinata</h1>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="file"
//                     onChange={handleFileChange}
//                     style={{ marginBottom: '10px', display: 'block', width: '100%' }}
//                 />
//                 <button
//                     type="submit"
//                     disabled={!file || uploading}
//                     style={{
//                         display: 'block',
//                         width: '100%',
//                         padding: '10px',
//                         backgroundColor: !file || uploading ? '#ccc' : '#007bff',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '5px',
//                         cursor: !file || uploading ? 'not-allowed' : 'pointer'
//                     }}
//                 >
//                     {uploading ? 'Uploading...' : 'Upload to Pinata'}
//                 </button>
//             </form>

//             {error && (
//                 <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffcccc', borderRadius: '5px' }}>
//                     {error}
//                 </div>
//             )}

//             {result && (
//                 <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#e6f3ff', borderRadius: '5px' }}>
//                     <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Upload Result:</h2>
//                     <p><strong>IPFS Hash:</strong> {result.ipfsHash}</p>
//                     <p><strong>Pinata URL:</strong> <a href={result.pinataUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>{result.pinataUrl}</a></p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default PinataUpload;

import React, {useState} from 'react'
import axios from 'axios'

const page = () => {
    const [file, setFile] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const fileData = new FormData()
            fileData.append('file', file)
            const responseData = await axios({
                method: "post",
                url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
                data: fileData,
                headers: {
                    pinata_api_key: 'a25b12c419c0c005544f',
                    pinata_secret_api_key: '03110679c4e45a5b29e6c71fc700007f1fdb6c7afce18affa0f3fe6e48c74543',
                    "Content-Type": 'multipart/form-data;'
                }
            })
            const fileUrl = `https://gateway.pinata.cloud/ipfs/${responseData.data.IpfsHash}`
            console.log('File uploaded successfully:', fileUrl)
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

  return (
    <div>
        <form>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit" onClick={handleSubmit}>Submit</button>
        </form>
    </div>
  )
}

export default page