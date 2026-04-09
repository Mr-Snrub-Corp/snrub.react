import { useEffect } from "react";
import { useUsersStore } from "@/stores/users";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, MoreHorizontalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback, getAvatarSrc } from "@/utils/user";
import { useAuthStore, selectIsSuperAdmin } from "@/stores/auth";
import { useNavigate } from "react-router";

function Team() {
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const users = useUsersStore((s) => s.users);

  const navigate = useNavigate();
  const isSuperAdmin = useAuthStore(selectIsSuperAdmin);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debug logger to be removed
  useEffect(() => {
    console.log("users", users);
  }, [users]);

  return (
    <div className="bg-grey-50 dark:bg-grey-950 px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-medium">Team</h1>
        {isSuperAdmin && <Button variant="primary">Add User</Button>}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Photo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => {
            return (
              <TableRow>
                <TableCell className="">
                  <Avatar className="border-grey-300 mr-2 border">
                    <AvatarImage src={getAvatarSrc(user)} alt={user?.name} />
                    <AvatarFallback>{getAvatarFallback(user)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        data-testid="view-user-btn"
                        onClick={() =>
                          navigate(`/dashboard/team/${user.uid}`)
                        }
                      >
                        <Eye />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      {isSuperAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive">
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default Team;
