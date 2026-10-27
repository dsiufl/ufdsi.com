'use client';
import Overlay from "@/components/Overlay/Overlay";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Profile } from "@/types/db";
import { useUser } from "@clerk/nextjs";
import { Edit, MoreVertical, Plus, Trash2, Users as UsersIcon } from "lucide-react";
import { useState } from "react";
import EditUser from "../../components/EditUser";
import { AddUserDialog } from "./AddUserDialog";


function UserOverlay({user, onClose}: {user: Profile, onClose: (updated?: Profile) => void}) {

    return (
        <Overlay close={() => {
            onClose();
        }} title={`Edit User: ${user.first_name} ${user.last_name}`}>
            <div>
                <EditUser admin={true} data={user} onSubmit={async (data: Profile) => {
                    return fetch('/api/users/edit', {
                        method: 'POST',
                        body: JSON.stringify({ user: {...data, id: user.id} }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                        if (res.status === 200) {
                            onClose({ ...user, ...data });
                        }
                    });
                }} />
            </div>
        </Overlay>
    )
}

function initials(user: Profile) {
    return `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() || "?";
}

export default function Users({data}: {data: Profile[]}) {
    const [ overlay, setOverlay ] = useState<Profile | undefined>(undefined);
    const [ deleteTarget, setDeleteTarget ] = useState<Profile | undefined>(undefined);
    const [ deleting, setDeleting ] = useState(false);
    const [ addUserOverlay, setAddUserOverlay ] = useState<boolean>(false);
    const [ newData, setNewData ] = useState<Profile[]>(data);
    const { user: currentUser } = useUser();

    async function handleDelete() {
        if (!deleteTarget) return;
        setDeleting(true);

        const res = await fetch('/api/users/delete', {
            method: 'POST',
            body: JSON.stringify({ user_id: deleteTarget.id }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
            setNewData((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        }
        setDeleting(false);
        setDeleteTarget(undefined);
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Manage users</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Invite and manage officer accounts
                    </p>
                </div>
                <Button
                    className="gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                    onClick={() => setAddUserOverlay(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add User
                </Button>
            </div>

            <AddUserDialog
                open={addUserOverlay}
                onOpenChange={setAddUserOverlay}
                onCreated={(user) => setNewData((prev) => [...prev, user])}
            />
            {overlay &&
                <UserOverlay user={overlay} onClose={(updated) => {
                    if (updated) {
                        setNewData((prev) => prev.map((u) => u.id === updated.id ? updated : u));
                    }
                    setOverlay(undefined);
                }} />
            }

            {newData.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card py-16">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <UsersIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">No users yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Get started by inviting your first officer
                    </p>
                    <Button
                        className="mt-6 gap-2 bg-[#FF5722] hover:bg-[#F4511E] text-white"
                        onClick={() => setAddUserOverlay(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Add User
                    </Button>
                </div>
            ) : (
                <div className="rounded-lg border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Visibility</TableHead>
                                <TableHead className="w-12"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {newData.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="cursor-pointer hover:bg-accent"
                                    onClick={() => setOverlay(user)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                                                {initials(user)}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.first_name} {user.last_name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.role}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={user.publish
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}
                                        >
                                            {user.publish ? "Public" : "Hidden"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell onClick={e => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setOverlay(user)}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit user
                                                </DropdownMenuItem>
                                                {user.id !== currentUser?.id && (
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onSelect={() => setTimeout(() => setDeleteTarget(user), 0)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete user
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(undefined)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {deleteTarget?.first_name} {deleteTarget?.last_name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(undefined)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
