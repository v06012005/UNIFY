package com.app.unify.mapper;

import com.app.unify.dto.global.HashtagDetailDTO;
import com.app.unify.entities.HashtagDetail;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HashtagDetailMapper {

    HashtagDetailDTO toHashtagDetailDTO(HashtagDetail hashtagDetail);

    HashtagDetail toHashtagDetail(HashtagDetailDTO hashtagDetailDTO);

    List<HashtagDetail> toHashtagDetailList(List<HashtagDetailDTO> dtoList);

    List<HashtagDetailDTO> toHashtagDetailDTOList(List<HashtagDetail> hashtags);
}
