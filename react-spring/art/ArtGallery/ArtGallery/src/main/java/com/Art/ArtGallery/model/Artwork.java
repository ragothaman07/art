package com.Art.ArtGallery.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "artworks")
public class Artwork {

    @Id
    private String id;

    private String imgName;
    private String caption;
    private String imageUrl;
    private String uploadedBy;
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    private Set<String> likedBy = new HashSet<>();

    @Builder.Default
    private List<Comment> comments = new ArrayList<>();
}