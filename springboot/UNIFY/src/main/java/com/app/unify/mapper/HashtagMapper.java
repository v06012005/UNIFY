package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.HashtagDTO;
import com.app.unify.entities.Hashtag;

@Mapper(componentModel = "spring")
public interface HashtagMapper {
	HashtagDTO toHashtagDTO(Hashtag hashtag);

	Hashtag toHashtag(HashtagDTO hashtagDTO);
}
