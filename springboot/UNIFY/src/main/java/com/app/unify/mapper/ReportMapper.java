package com.app.unify.mapper;

import org.mapstruct.Mapper;

import com.app.unify.dto.global.ReportDTO;
import com.app.unify.entities.Report;

@Mapper(componentModel = "spring")
public interface ReportMapper {
	ReportDTO toReportDTO(Report report);

	Report toReport(ReportDTO reportDTO);
}