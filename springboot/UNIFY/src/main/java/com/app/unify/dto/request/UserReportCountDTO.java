package com.app.unify.dto.request;

import com.app.unify.entities.User;

public record UserReportCountDTO(String id,String username, String email, Long reportApprovalCount) {}