'use client';
import Loading from "@/components/Loading/Loading";
import Overlay from "@/components/Overlay/Overlay";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createUserClient } from "@/lib/supabase/client";
import { AdminInfo, Profile } from "@/types/db";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { User } from "@supabase/supabase-js";
import { Edit, EllipsisIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import EditUser from "../../components/EditUser";
import { supabase } from "@/lib/main";


function UserOverlay({user, token, onClose}: {user: Profile, token: string | undefined, onClose: () => void}) {
    
    return (
        <Overlay close={() => {
            onClose();
        }} title={`Edit User: ${user.first_name} ${user.last_name}`}>
            <div>
                <EditUser admin={true} data={user} onSubmit={async (data: Profile) => {
                    console.log("submitted", data);
                    console.log("token:", token)
                    console.log(user.id)
                    return fetch('/api/users/edit', {
                        method: 'POST',
                        body: JSON.stringify({access_token: token, user: {...data, id: user.id}}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                        if (res.status === 200) {
                            console.log("user edited");
                            onClose();
                        }
                    });
                    
                }} />
            </div>
        </Overlay>
    )
}

function DeleteOverlay({user, token, onClose}: {user: Profile, token: string | undefined, onClose: (user?: Profile) => void}) {
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ error, setError ] = useState<string | undefined>(undefined);
    
    return (
        <Overlay close={() => {
            onClose();
        }} title={`Delete User: ${user.first_name} ${user.last_name}`}>
            {loading?<Loading message="Deleting user..." />:<div>
                { error && <p className="!text-red-500">{error}</p> }
                <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                <div className="flex flex-row gap-4 mt-4">
                    <Button variant="destructive" onClick={() => {
                        setLoading(true);
                        setError(undefined);
                        
                        fetch('/api/users/delete', {
                            method: 'POST',
                            body: JSON.stringify({access_token: token, user_id: user.id}),
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((res) => {
                            setLoading(false);
                            if (res.status !== 200) {
                                setError("Failed to delete user.");
                                return;
                            }
                            console.log("user deleted");
                            onClose(user);
                            
                        });
                    }}>Delete</Button>
                    
                    <Button variant="secondary" onClick={() => onClose()}>Cancel</Button>
                </div>
            </div>}
        </Overlay>
    )
}

function AddUserOverlay({onClose, token}: {onClose: (user?: Profile) => void, token: string | undefined}) {
    return (
        <Overlay close={() => {
            onClose();
        }} title={`Add User`}>
            <div>
                <EditUser admin={true} data={{} as Profile} onSubmit={async (data: Profile) => {
                    return fetch('/api/users/create', {
                        method: 'POST',
                        body: JSON.stringify({access_token: token, user: data}),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((res) => {
                        if (res.status === 200) {
                            console.log("user created");
                            onClose();
                        }
                    });
                }} />
            </div>
        </Overlay>
    )
}

export default function Users({data}: {data: Profile[]}) {
    const [ overlay, setOverlay ] = useState<Profile | undefined>(undefined); 
    const [ deleteOverlay, setDeleteOverlay ] = useState<Profile | undefined>(undefined);
    const [ addUserOverlay, setAddUserOverlay ] = useState<boolean>(false);
    const [ token, setToken ] = useState<string | undefined>(undefined);
    const [ currentUser, setCurrentUser ] = useState<User | undefined>(undefined);
    const [ newData, setNewData ] = useState<Profile[]>(data);
    const supabase = createUserClient();
    useEffect(() => {
        supabase.auth.getSession().then((result) => {
            if (result.data.session) {
                setToken(result.data.session.access_token);
                setCurrentUser(result.data.session.user);
            }
        })
    }, [])
    
    return (
        <div className="flex w-full h-full flex-col items-center bg-gray-100 dark:bg-[#000000]/30 px-10">
            <Button className="mt-2" onClick={() => setAddUserOverlay(true)}>
                <PlusIcon />Add User
            </Button>
            {addUserOverlay && <AddUserOverlay onClose={() => setAddUserOverlay(false)} token={token} />}
            {overlay && 
                <UserOverlay token={token} user={overlay} onClose={(user?) => {
                    setOverlay(undefined);
                    if (user) {
                        const updated = newData.map((u) => u.id === user.id ? user : u);
                        setNewData(updated);
                    }
                }} />
            }
            {
                deleteOverlay && 
                <DeleteOverlay user={deleteOverlay} token={token} onClose={async (user?: Profile) => {
                    if (user) {
                        const filtered = newData.filter((u) => u.id !== user.id);
                        setNewData(filtered);
                    }
                    setDeleteOverlay(undefined);
                }} />
            }
            <Table className="w-full text-center bg-sky-50 dark:bg-gray-700 max-h-[40rem]">
                <TableHeader className="!sticky top-0 bg-sky-100 dark:bg-black">
                    <TableRow>
                        <TableCell>First Name</TableCell>
                        <TableCell>Last Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    {newData.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.first_name}</TableCell>
                            <TableCell>{user.last_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                        <EllipsisIcon className="cursor-pointer"/>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem className="">
                                            <Button variant="ghost" className="w-full text-left dark:!text-white !text-black bg-transparent hover:!border-0 hover:!-translate-y-0" onClick={() => setOverlay(user)}>Edit user</Button>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="">
                                            <Button variant="ghost" className="w-full text-left dark:!text-white !text-black bg-transparent hover:!border-0 hover:!-translate-y-0" onClick={() => {
                                                fetch('/api/users/email', {
                                                    method: 'POST',
                                                    body: JSON.stringify({access_token: token, user}),
                                                })
                                            }}>Send invite email</Button>
                                        </DropdownMenuItem>
                                        {
                                            user.id !== currentUser?.id &&
                                            <DropdownMenuItem>
                                                <Button variant="ghost" className="w-full dark:!text-white !text-black text-left bg-transparent hover:!border-0 hover:!-translate-y-0 hover:bg-red-500/30" onClick={() => setDeleteOverlay(user)}>Delete user</Button>
                                            </DropdownMenuItem>
                                        }
                                        
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableHeader>
            </Table>
        </div>
    )
}