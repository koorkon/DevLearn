package com.devlearn.util;

import org.apache.poi.xslf.usermodel.XMLSlideShow;
import org.apache.poi.xslf.usermodel.XSLFShape;
import org.apache.poi.xslf.usermodel.XSLFSlide;
import org.apache.poi.xslf.usermodel.XSLFTextShape;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/**
 * PPTX Text Extractor
 * Extracts text content from PPTX files using Apache POI
 *
 * @author Anudari Ganbaatar (12327086)
 */
@Component
public class PPTExtractor {

    /**
     * Extract text from PPTX file
     * @param pptFile PPTX file to process
     * @return Extracted text content
     * @throws IOException if file cannot be read
     */
    public String extractText(File pptFile) throws IOException {
        StringBuilder text = new StringBuilder();

        try (FileInputStream fis = new FileInputStream(pptFile);
             XMLSlideShow ppt = new XMLSlideShow(fis)) {

            for (XSLFSlide slide : ppt.getSlides()) {
                for (XSLFShape shape : slide.getShapes()) {
                    if (shape instanceof XSLFTextShape) {
                        XSLFTextShape textShape = (XSLFTextShape) shape;
                        text.append(textShape.getText()).append("\n");
                    }
                }
            }
        }

        return text.toString();
    }
}