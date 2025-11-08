/**
 * Utest Domain Types
 * Shared across all services and frontend
 */
export interface UtestData {
    id: string;
    userId: string;
    name: string;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}
//# sourceMappingURL=types.d.ts.map