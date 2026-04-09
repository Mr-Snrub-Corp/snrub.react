import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";

function UserNew() {
  const [serverError, setServerError] = useState("");

  const userSchema = z.object({
    email: z.email({ error: "Please enter a valid email address" }),
    name: z.string().min(2, { error: "Please enter a the employees name" }),
    // role: z.role({ error: "Please enter a the employee role"})
  });

  const form = useForm({
    defaultValues: { email: "", name: "" },
  });

  return (
    <div className="bg-grey-50 dark:bg-grey-950 h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <h1 className="text-grey-900 dark:text-grey-50 text-3xl font-bold">
          Add Team Member
        </h1>
      </div>
    </div>
  );
}

export default UserNew;
