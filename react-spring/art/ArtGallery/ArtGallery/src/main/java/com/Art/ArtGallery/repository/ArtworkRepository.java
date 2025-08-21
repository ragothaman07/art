package com.Art.ArtGallery.repository;

import com.Art.ArtGallery.model.Artwork;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ArtworkRepository extends MongoRepository<Artwork, String> {
    List<Artwork> findByImgNameContainingIgnoreCase(String imgName);
}