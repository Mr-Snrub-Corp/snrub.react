import { useEffect, useState } from "react";
import { useUsersStore } from "@/stores/users";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
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
import { Eye, MoreVerticalIcon, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarFallback, getAvatarSrc } from "@/utils/user";
import { useAuthStore, selectIsSuperAdmin } from "@/stores/auth";
import { useNavigate } from "react-router";

function Employees() {
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const deleteUser = useUsersStore((s) => s.deleteUser);
  const users = useUsersStore((s) => s.users);

  const [pendingDeleteUid, setPendingDeleteUid] = useState<string | null>(null);

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
        {isSuperAdmin && (
          <Button
            variant="primary"
            data-testid="employees.list.add-btn"
            onClick={() => navigate(`/dashboard/employees/new`)}
          >
            Add User
          </Button>
        )}
      </div>
      <Table data-testid="employees.list.table">
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
                  {/* Inline buttons: xl+ */}
                  <div className="hidden justify-end gap-1 xl:flex">
                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        data-testid="employees.list.delete-btn"
                        onClick={() => setPendingDeleteUid(user.uid)}
                      >
                        <Trash2 />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      data-testid="employees.list.view-btn"
                      onClick={() => navigate(`/dashboard/employees/${user.uid}`)}
                    >
                      <Eye />
                      <span className="sr-only">View</span>
                    </Button>
                  </div>

                  {/* Dropdown menu: below xl */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="xl:hidden"
                      >
                        <MoreVerticalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        data-testid="employees.list.view-btn"
                        onClick={() => navigate(`/dashboard/employees/${user.uid}`)}
                      >
                        View
                      </DropdownMenuItem>
                      {isSuperAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            data-testid="employees.list.delete-btn"
                            onClick={() => setPendingDeleteUid(user.uid)}
                          >
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
      <DeleteConfirmDialog
        open={pendingDeleteUid !== null}
        header="Delete User"
        confirmButtonLabel="Delete"
        onClose={() => setPendingDeleteUid(null)}
        onConfirm={() => {
          if (pendingDeleteUid) deleteUser(pendingDeleteUid);
          setPendingDeleteUid(null);
        }}
      />
    </div>
  );
}

export default Employees;
