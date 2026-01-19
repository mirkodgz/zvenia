
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker locally to avoid CORS/CDN issues
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

interface PdfViewerProps {
    url: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    return (
        <div className="w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 mt-4 mb-4">
            {/* Header / Controls */}
            <div className="flex justify-between items-center bg-slate-800 px-4 py-2 border-b border-slate-700">
                <span className="text-white text-sm font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" /><path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" /></svg>
                    PDF Document
                </span>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                        disabled={pageNumber <= 1}
                        className="text-gray-300 hover:text-white disabled:opacity-50 text-sm p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <span className="text-gray-400 text-xs font-mono">
                        {pageNumber} / {numPages || '--'}
                    </span>

                    <button
                        onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                        disabled={pageNumber >= numPages}
                        className="text-gray-300 hover:text-white disabled:opacity-50 text-sm p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>

                    <div className="h-4 w-px bg-gray-600 mx-2"></div>

                    {/* Download */}
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 pointer-cursor" title="Download">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    </a>
                </div>
            </div>

            {/* Viewer Area */}
            <div className="flex justify-center bg-slate-100 p-4 min-h-[300px] overflow-auto">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex justify-center shadow-lg"
                    loading={<div className="text-gray-600 animate-pulse">Loading Document...</div>}
                    error={<div className="text-red-500 text-sm p-4">Unable to render PDF. <a href={url} className="underline" target="_blank">Download File</a></div>}
                >
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={550}
                        className="bg-white shadow-xl"
                    />
                </Document>
            </div>
        </div>
    );
};
