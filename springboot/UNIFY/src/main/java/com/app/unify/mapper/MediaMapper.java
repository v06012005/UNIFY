package com.app.unify.mapper;

import com.app.unify.dto.global.MediaDTO;
import com.app.unify.entities.Media;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MediaMapper {

    Media toMedia(MediaDTO mediaDTO);

    MediaDTO toMediaDTO(Media media);
}
