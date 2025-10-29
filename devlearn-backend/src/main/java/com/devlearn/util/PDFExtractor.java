package com.devlearn.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

/**
 * PDF Text Extractor
 * Extracts text content from PDF files using Apache PDFBox
 *
 * @author Anudari Ganbaatar (12327086)
 */
@Component
public class PDFExtractor {

    /**
     * Extract text from PDF file
     * @param pdfFile PDF file to process
     * @return Extracted text content
     * @throws IOException if file cannot be read
     */
    public String extractText(File pdfFile) throws IOException {
        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}