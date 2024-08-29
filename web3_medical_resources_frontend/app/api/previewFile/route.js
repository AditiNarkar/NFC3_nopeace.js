import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { PDFDocument } from 'pdf-lib';
import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: process.env.PINATA_GATEWAY,
  });

export default async function GET(request) {
    const { searchParams } = new URL(request.url);
    const cid = searchParams.get('cid');

    if (!cid) {
        return NextResponse.json({ error: 'CID is required' }, { status: 400 });
    }

    try {
        const pdfResponse = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`);
        const pdfBytes = await pdfResponse.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [firstPage] = await pdfDoc.saveAsBase64({ dataUri: true });

        return NextResponse.json({ previewUrl: firstPage });
    } catch (error) {
        console.error('Error generating preview:', error); // Log error here
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
    }
}
