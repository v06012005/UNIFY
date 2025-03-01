package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.HashtagDTO;
import com.app.unify.dto.global.HashtagDetailDTO;
import com.app.unify.entities.Hashtag;
import com.app.unify.entities.HashtagDetail;

@Mapper(componentModel = "spring")
public interface HashtagDetailMapper {
	HashtagDetailDTO toHashtagDetailDTO(HashtagDetail hashtagDetail);

	HashtagDetail toHashtagDetail(HashtagDetailDTO hashtagDetailDTO);
}
