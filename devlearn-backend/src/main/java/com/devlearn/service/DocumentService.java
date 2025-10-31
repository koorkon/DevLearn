package com.devlearn.service;

import com.devlearn.model.Document;
import com.devlearn.repository.DocumentRepository;
import com.devlearn.util.PDFExtractor;
import com.devlearn.util.PPTExtractor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

/**
 * Document Service
 * Handles document upload, storage, and text extraction
 *
 * @author Anudari Ganbaatar (12327086)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final PDFExtractor pdfExtractor;
    private final PPTExtractor pptExtractor;

    @Value("${devlearn.upload-dir}")
    private String uploadDir;

    /**
     * Upload and process document
     */
    public Document uploadDocument(MultipartFile file) throws IOException {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);

        if (!fileExtension.equals("pdf") && !fileExtension.equals("pptx")) {
            throw new IllegalArgumentException("Only PDF and PPTX files are supported");
        }

        // Create upload directory
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String storedFilename = UUID.randomUUID().toString() + "." + fileExtension;
        Path filePath = uploadPath.resolve(storedFilename);

        // Save file
        Files.copy(file.getInputStream(), filePath);
        log.info("File saved: {}", storedFilename);

        // Extract text
        String extractedText = extractText(filePath.toFile(), fileExtension);
        log.info("Text extracted: {} characters", extractedText.length());

        // Create document entity
        Document document = new Document();
        document.setOriginalFilename(originalFilename);
        document.setStoredFilename(storedFilename);
        document.setFileType(fileExtension.toUpperCase());
        document.setFileSize(file.getSize());
        document.setExtractedText(extractedText);
        document.setProcessingStatus("PENDING");

        // Save to database
        Document savedDocument = documentRepository.save(document);
        log.info("Document saved to database with ID: {}", savedDocument.getId());

        return savedDocument;
    }

    private String extractText(File file, String fileType) throws IOException {
        if ("pdf".equalsIgnoreCase(fileType)) {
            return pdfExtractor.extractText(file);
        } else if ("pptx".equalsIgnoreCase(fileType)) {
            return pptExtractor.extractText(file);
        }
        throw new IllegalArgumentException("Unsupported file type");
    }

    private String getFileExtension(String filename) {
        if (filename == null) return "";
        int lastDotIndex = filename.lastIndexOf('.');
        return (lastDotIndex == -1) ? "" : filename.substring(lastDotIndex + 1);
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public void updateProcessingStatus(Long documentId, String status) {
        Document document = getDocumentById(documentId);
        document.setProcessingStatus(status);
        documentRepository.save(document);
    }
}