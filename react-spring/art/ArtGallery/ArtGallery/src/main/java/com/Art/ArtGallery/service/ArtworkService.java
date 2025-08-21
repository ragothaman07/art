package com.Art.ArtGallery.service;

import com.Art.ArtGallery.model.Artwork;
import com.Art.ArtGallery.model.Comment;
import com.Art.ArtGallery.model.User;
import com.Art.ArtGallery.repository.ArtworkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class ArtworkService {

    private static final String UPLOAD_DIR = "uploads/";
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );

    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private UserService userService;

    public Artwork upload(MultipartFile file, String imgName, String caption, String uploadedBy) throws Exception {
        // Validate file type
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException("Invalid file type. Only images are allowed.");
        }

        // Create unique filename to avoid overwrites
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        Path path = Paths.get(UPLOAD_DIR + uniqueFilename);
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        System.out.println("=== DEBUG: Artwork Upload ===");
        System.out.println("Received uploadedBy: '" + uploadedBy + "'");
        System.out.println("Type: " + (uploadedBy != null ? uploadedBy.getClass().getName() : "null"));
        System.out.println("Length: " + (uploadedBy != null ? uploadedBy.length() : 0));

        String username = "Unknown Artist";

        try {
            // Check if uploadedBy is already a username (contains spaces or is short)
            if (uploadedBy != null && uploadedBy.length() > 2 && uploadedBy.length() < 50 &&
                    (uploadedBy.contains(" ") || !uploadedBy.matches(".*\\d.*"))) {
                username = uploadedBy;
                System.out.println("Using as username directly: " + username);
            } else {
                // Try to find user by ID first
                System.out.println("Trying to find user by ID: " + uploadedBy);
                Optional<User> user = userService.findById(uploadedBy);
                if (user.isPresent()) {
                    username = user.get().getName();
                    System.out.println("Found user by ID: " + username);
                } else {
                    System.out.println("User not found by ID, trying by email...");
                    // Try by email
                    Optional<User> userByEmail = userService.findByEmail(uploadedBy);
                    if (userByEmail.isPresent()) {
                        username = userByEmail.get().getName();
                        System.out.println("Found user by email: " + username);
                    } else {
                        System.out.println("User not found by email either");
                        // Final fallback - use as username if it looks reasonable
                        if (uploadedBy != null && uploadedBy.length() > 2 && uploadedBy.length() < 50) {
                            username = uploadedBy;
                            System.out.println("Fallback to using as username: " + username);
                        }
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("Error finding user: " + e.getMessage());
            // If we can't find the user, use the provided value if it looks like a name
            if (uploadedBy != null && uploadedBy.length() > 2 && uploadedBy.length() < 50) {
                username = uploadedBy;
            }
        }

        System.out.println("Final username: " + username);
        System.out.println("=============================");

        Artwork artwork = Artwork.builder()
                .imgName(imgName)
                .caption(caption)
                .imageUrl("/uploads/" + uniqueFilename)
                .uploadedBy(username)
                .createdAt(LocalDateTime.now())
                .build();

        return artworkRepository.save(artwork);
    }

    // ... rest of the methods remain the same
    public List<Artwork> getAll() {
        List<Artwork> artworks = artworkRepository.findAll();
        // Ensure all artworks have proper uploadedBy values
        artworks.forEach(artwork -> {
            if (artwork.getUploadedBy() == null ||
                    artwork.getUploadedBy().isEmpty() ||
                    artwork.getUploadedBy().equals("null")) {
                artwork.setUploadedBy("Unknown Artist");
            }
        });
        return artworks;
    }

    public int toggleLike(String artworkId, String userId) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        if (artwork.getLikedBy().contains(userId)) {
            artwork.getLikedBy().remove(userId);
        } else {
            artwork.getLikedBy().add(userId);
        }

        artworkRepository.save(artwork);
        return artwork.getLikedBy().size();
    }

    public List<Comment> addComment(String artworkId, Comment comment) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));

        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }
        if (comment.getUserName() == null) {
            comment.setUserName(comment.getUserId());
        }

        artwork.getComments().add(comment);
        artworkRepository.save(artwork);
        return artwork.getComments();
    }

    public List<Artwork> searchByName(String imgName) {
        return artworkRepository.findByImgNameContainingIgnoreCase(imgName);
    }

    public Artwork getArtworkById(String id) {
        Artwork artwork = artworkRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artwork not found with id: " + id));

        // Ensure proper uploadedBy value
        if (artwork.getUploadedBy() == null || artwork.getUploadedBy().isEmpty()) {
            artwork.setUploadedBy("Unknown Artist");
        }

        return artwork;
    }

    public boolean hasUserLiked(String artworkId, String userId) {
        Artwork artwork = artworkRepository.findById(artworkId)
                .orElseThrow(() -> new RuntimeException("Artwork not found"));
        return artwork.getLikedBy().contains(userId);
    }
}