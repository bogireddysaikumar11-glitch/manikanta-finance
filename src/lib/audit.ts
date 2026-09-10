import { prisma } from "./prisma";

export async function recordAuditLog({
  entityType,
  entityId,
  action,
  performedBy = "Admin",
  description,
  oldValue = null,
  newValue = null,
  ipAddress = "127.0.0.1",
  userId = null,
}: {
  entityType: string;
  entityId: string | number;
  action: string;
  performedBy?: string;
  description: string;
  oldValue?: any;
  newValue?: any;
  ipAddress?: string;
  userId?: number | null;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        entityType,
        entityId: String(entityId),
        action,
        performedBy,
        description,
        oldValue: oldValue ? JSON.stringify(oldValue) : "{}",
        newValue: newValue ? JSON.stringify(newValue) : "{}",
        ipAddress,
        userId,
      },
    });
  } catch (error) {
    console.error("Failed to record audit log:", error);
  }
}
