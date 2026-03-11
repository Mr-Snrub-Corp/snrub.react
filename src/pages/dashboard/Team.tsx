import { useEffect } from "react";
import { useUsersStore } from "@/stores/users";

function Team() {
  const fetchUsers = useUsersStore((s) => s.fetchUsers);
  const users = useUsersStore((s) => s.users);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    console.log("users", users);
  }, [users]);

  return <h1 className="text-3xl font-medium">Team</h1>;
}

export default Team;
