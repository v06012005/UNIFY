package com.app.unify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.entities.Report;

@Mapper(componentModel = "spring", uses = { UserMapper.class, PostMapper.class, CommentMapper.class })

public interface ReportMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "entityType", ignore = true)
    Report toReport(ReportDTO reportDTO);

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "reportedEntity", ignore = true)
    ReportDTO toReportDTO(Report report);
}
