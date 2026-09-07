import { prisma } from "../../lib/prisma";

export const getWorkspaceById = async (id: string) => {
    const workspace = await prisma.workspace.findUnique({
        where: {
            id
        }
    });

    return workspace;
};

export const getWorkspaceMembership = async (workspaceId: string, userId: string) => {
    const workspace = await prisma.workspaceMember.findUnique({
        where: {
            userId_workspaceId: {
                userId,
                workspaceId
            }
        }
    });

    return workspace;
};