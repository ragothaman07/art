package com.Art.ArtGallery.controller;

import com.Art.ArtGallery.model.Artwork;
import com.Art.ArtGallery.model.Comment;
import com.Art.ArtGallery.service.ArtworkService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/artworks")
@Validated
public class ArtworkController {

    @Autowired
    private ArtworkService artworkService;

    @GetMapping
    public ResponseEntity<List<Artwork>> getAll() {
        return ResponseEntity.ok(artworkService.getAll());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("image") MultipartFile file,
            @RequestParam("imgName") @NotBlank String imgName,
            @RequestParam("caption") String caption,
            @RequestParam("uploadedBy") @NotBlank String uploadedBy,
            @RequestParam(value = "userName", required = false) String userName) {
        try {
            System.out.println("Controller received - uploadedBy: " + uploadedBy + ", userName: " + userName);

            // Use userName if provided, otherwise use uploadedBy
            String finalUploader = (userName != null && !userName.trim().isEmpty()) ? userName : uploadedBy;

            Artwork artwork = artworkService.upload(file, imgName, caption, finalUploader);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "success", true,
                    "artwork", artwork,
                    "message", "Artwork uploaded successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable String id,
            @RequestParam @NotBlank String userId) {
        try {
            int likeCount = artworkService.toggleLike(id, userId);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "likes", likeCount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<?> addComment(
            @PathVariable String id,
            @Valid @RequestBody Comment comment) {
        try {
            // Ensure userName is set
            if (comment.getUserName() == null || comment.getUserName().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "User name is required"
                ));
            }

            List<Comment> comments = artworkService.addComment(id, comment);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "comments", comments
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Artwork>> search(@RequestParam String q) {
        return ResponseEntity.ok(artworkService.searchByName(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArtworkById(@PathVariable String id) {
        try {
            Artwork artwork = artworkService.getArtworkById(id);
            return ResponseEntity.ok(artwork);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}/hasLiked")
    public ResponseEntity<Map<String, Boolean>> hasUserLiked(
            @PathVariable String id,
            @RequestParam String userId) {
        try {
            boolean liked = artworkService.hasUserLiked(id, userId);
            return ResponseEntity.ok(Map.of("liked", liked));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("liked", false));
        }
    }
}