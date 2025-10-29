package com.devlearn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * Document Entity
 * Represents uploaded PDF/PPTX documents
 *
 * @author Anudari Ganbaatar (12327086)
 */
@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String originalFilename;

    @Column(nullable = false)
    private String storedFilename;

    @Column(nullable = false)
    private String fileType; // PDF or PPTX

    @Column(nullable = false)
    private Long fileSize;

    @Column(nullable = false, length = 10000)
    private String extractedText;

    @Column(name = "processing_status", nullable = false)
    private String processingStatus; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "upload_timestamp", nullable = false)
    private LocalDateTime uploadTimestamp;

    @PrePersist
    protected void onCreate() {
        uploadTimestamp = LocalDateTime.now();
        processingStatus = "PENDING";
    }
}