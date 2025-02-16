package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.MediaDTO;
import com.app.unify.entities.Media;

@Mapper(componentModel = "spring")
public interface MediaMapper {
	Media toMedia(MediaDTO mediaDTO);
	
	MediaDTO toMediaDTO(Media media);
}
