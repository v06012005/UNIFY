package com.app.unify.mapper;

import java.util.List;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.HashtagDTO;
import com.app.unify.entities.Hashtag;

@Mapper(componentModel = "spring")
public interface HashtagMapper {

    HashtagDTO toHashtagDTO(Hashtag hashtag);

    Hashtag toHashtag(HashtagDTO hashtagDTO);

    List<Hashtag> toHashtagList(List<HashtagDTO> dtoList);


    List<HashtagDTO> toHashtagDTOList(List<Hashtag> hashtags);
}
