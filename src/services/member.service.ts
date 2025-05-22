// import { ErrorCodeEnum } from "../enums/error-code.enum";
// import { Roles } from "../enums/role.enum";
// import MemberModel from "../models/member.model";
// import RoleModel from "../models/roles-permission.model";
// import WorkspaceModel from "../models/workspace.model";
// import {
//   BadRequestException,
//   NotFoundException,
//   UnauthorizedException,
// } from "../utils/appError";

// export const getMemberRoleInWorkspace = async (
//   userId: string,
//   workspaceId: string
// ) => {
//   const workspace = await WorkspaceModel.findById(workspaceId);
//   if (!workspace) {
//     throw new NotFoundException("Workspace not found");
//   }

//   const member = await MemberModel.findOne({
//     userId,
//     workspaceId,
//   }).populate("role");

//   if (!member) {
//     throw new UnauthorizedException(
//       "You are not a member of this workspace",
//       ErrorCodeEnum.ACCESS_UNAUTHORIZED
//     );
//   }

//   const roleName = member.role?.name;
//   return { role: roleName };
// };

// export const joinWorkspaceByInviteService = async (
//   userId: string,
//   inviteCode: string
// ) => {
//   // Find workspace by invite code
//   const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();
//   console.log("Invite code received:", inviteCode);
//  if (!workspace) {
//   console.error("No workspace found with invite code:", inviteCode);
//   throw new NotFoundException("Invalid invite code or workspace not found");
// }


//   // Check if user is already a member
//   const existingMember = await MemberModel.findOne({
//     userId,
//     workspaceId: workspace._id,
//   }).exec();

//   if (existingMember) {
//     throw new BadRequestException("You are already a member of this workspace");
//   }

//   // Find the "Member" role
//   const role = await RoleModel.findOne({ name: Roles.MEMBER });
//   if (!role) {
//     throw new NotFoundException("Role not found");
//   }

//   // Add user to workspace as a member
//   await MemberModel.create({
//     userId,
//     workspaceId: workspace._id,
//     role: role._id,
//   });

//   return { workspaceId: workspace._id, role: role.name };
// };


import { ErrorCodeEnum } from "../enums/error-code.enum";
import { Roles } from "../enums/role.enum";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import WorkspaceModel from "../models/workspace.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";

/**
 * Get the role of a member in a workspace
 */
export const getMemberRoleInWorkspace = async (
  userId: string,
  workspaceId: string
) => {
  const workspace = await WorkspaceModel.findById(workspaceId);

  if (!workspace) {
    throw new NotFoundException(
      "Workspace not found",
      ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }

  const member = await MemberModel.findOne({
    userId,
    workspaceId,
  }).populate("role");

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this workspace",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const roleName = member.role?.name;
  return { role: roleName };
};

/**
 * Join a workspace using an invite code
 */
export const joinWorkspaceByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  console.log("Invite code received:", inviteCode);

  // Find workspace by invite code
  const workspace = await WorkspaceModel.findOne({ inviteCode }).exec();

  if (!workspace) {
    console.error("No workspace found with invite code:", inviteCode);
    throw new NotFoundException(
      "Invalid invite code or workspace not found",
      ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }

  // Check if user is already a member
  const existingMember = await MemberModel.findOne({
    userId,
    workspaceId: workspace._id,
  }).exec();

  if (existingMember) {
    throw new BadRequestException(
      "You are already a member of this workspace",
      ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS
    );
  }

  // Find the "Member" role
  const role = await RoleModel.findOne({ name: Roles.MEMBER });
  if (!role) {
    throw new NotFoundException(
      "Role not found",
      ErrorCodeEnum.RESOURCE_NOT_FOUND
    );
  }

  // Add user to workspace as a member
  await MemberModel.create({
    userId,
    workspaceId: workspace._id,
    role: role._id,
  });

  console.log(`User ${userId} successfully added to workspace ${workspace._id}`);

  return {
    workspaceId: workspace._id,
    role: role.name,
  };
};
