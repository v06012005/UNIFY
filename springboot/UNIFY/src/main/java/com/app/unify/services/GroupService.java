package com.app.unify.services;

import com.app.unify.dto.global.GroupDTO;
import com.app.unify.dto.global.GroupMemberDTO;
import com.app.unify.dto.global.GroupMembershipResponse;
import com.app.unify.types.PrivacyType;
import com.app.unify.types.GroupStatus;
import java.util.List;

public interface GroupService {
	GroupDTO createGroup(GroupDTO groupDTO, String ownerId);

	GroupDTO updateGroup(String groupId, GroupDTO groupDTO);

	void deleteGroup(String groupId);

	GroupDTO getGroup(String groupId);

	List<GroupDTO> getAllGroups();

	GroupMemberDTO joinGroup(String groupId, String userId);

	// New methods for enhanced group functionality
	List<GroupDTO> getGroupsByPrivacyType(PrivacyType privacyType);

	List<GroupDTO> getGroupsByStatus(GroupStatus status);

	GroupDTO updateGroupStatus(String groupId, GroupStatus status);

	GroupDTO updateGroupPrivacy(String groupId, PrivacyType privacyType);

	// Method to get groups where current user is a member
	List<GroupDTO> getGroupsByCurrentUser();

	void leaveGroup(String groupId);

	GroupMembershipResponse checkMembership(String groupId);
	List<GroupMemberDTO> getGroupMembers(String groupId);
}