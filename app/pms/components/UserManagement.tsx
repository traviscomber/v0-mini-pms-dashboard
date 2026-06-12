'use client';

import { User, UserRole } from '../types';
import { getRoleDescription, roleColors } from '../lib/rbac';
import { Trash2, Plus, CheckCircle2, Circle } from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onAddUser?: () => void;
  onDeleteUser?: (userId: string) => void;
  onToggleActive?: (userId: string) => void;
}

const roleOptions: UserRole[] = ['owner', 'manager', 'reception', 'housekeeping', 'finance', 'guest'];

export default function UserManagement({
  users,
  onAddUser,
  onDeleteUser,
  onToggleActive,
}: UserManagementProps) {
  const activeCount = users.filter((u) => u.isActive).length;
  const roleBreakdown = roleOptions.map((role) => ({
    role,
    count: users.filter((u) => u.role === role).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Total Users</p>
          <p className="text-2xl font-bold mt-1">{users.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Active Users</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-foreground/60">Inactive</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{users.length - activeCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {roleBreakdown.map(({ role, count }) => (
          <div key={role} className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs text-foreground/60 capitalize">{role}</p>
            <p className="text-lg font-bold mt-1">{count}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Team Members</h3>
          <button
            onClick={onAddUser}
            className="flex items-center gap-2 px-3 py-2 bg-primary text-foreground rounded-lg text-sm font-medium hover:bg-primary/80 transition"
          >
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Role</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Joined</th>
                <th className="px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className={idx % 2 === 0 ? 'border-b border-border' : 'border-b border-border bg-background/50'}
                >
                  <td className="px-6 py-3 font-medium">{user.name}</td>
                  <td className="px-6 py-3 text-sm text-foreground/60">{user.email}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs px-2 py-1 rounded capitalize ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {user.isActive ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-xs text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4 text-foreground/50" />
                          <span className="text-xs text-foreground/70">Inactive</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs text-foreground/60">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      onClick={() => onToggleActive?.(user.id)}
                      className="px-2 py-1 text-xs hover:bg-background rounded transition mr-2"
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => onDeleteUser?.(user.id)}
                      className="px-2 py-1 text-xs text-red-600 hover:bg-red-500/10 rounded transition"
                    >
                      <Trash2 className="w-3 h-3 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {roleOptions.map((role) => (
          <div key={role} className="bg-card border border-border rounded-lg p-3">
            <p className={`text-xs font-semibold capitalize ${roleColors[role]}`}>{role}</p>
            <p className="text-xs text-foreground/60 mt-2">{getRoleDescription(role)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
