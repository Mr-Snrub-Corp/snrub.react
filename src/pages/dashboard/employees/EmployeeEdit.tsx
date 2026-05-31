import { useEffect } from "react";

function EmployeeEdit() {
  useEffect(() => {
    document.title = "Snrub Corp | Edit Team Member";
  }, []);

  return (
    <div className="bg-grey-50 dark:bg-grey-950 h-screen px-6 py-4 md:px-12 md:py-6 lg:px-20 lg:py-8">
      <div className="mb-4 flex items-center justify-between xl:w-3/4">
        <h1 className="text-grey-900 dark:text-grey-50 text-3xl font-bold">
          Edit Employee Details
        </h1>
      </div>
      <div className="dark:bg-grey-900 mb-6 flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm xl:w-3/4">
        <div className="text-grey-900 dark:text-grey-50 text-xl font-medium">
          Profile
        </div>
      </div>
    </div>
  );
}

export default EmployeeEdit;

// email: "",
// name: "",
// role: "",
// status: USER_STATUS.ACTIVE,
// photo: "",
