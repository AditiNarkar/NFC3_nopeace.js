import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';

const pinata = new pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

export async function POST(request) {
  console.log('Received POST request to /api/uploadPinata');

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      console.log('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('File received:', file.name);

    if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
      console.error('Pinata API keys are not set in environment variables');
      return NextResponse.json({ error: 'Pinata configuration error' }, { status: 500 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    console.log('Uploading file to Pinata...');
    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: {
        name: file.name,
      },
      pinataOptions: {
        cidVersion: 1,
      },
    });

    console.log('File uploaded successfully:', result);

    const gatewayUrl = process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud';
    const fileUrl = `${gatewayUrl}/ipfs/${result.IpfsHash}`;

    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      pinataUrl: fileUrl
    });
  } catch (error) {
    console.error('Error in /api/uploadPinata:', error);
    return NextResponse.json({ error: 'Error uploading to Pinata: ' + error.message }, { status: 500 });
  }
}
