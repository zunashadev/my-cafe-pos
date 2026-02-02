import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CreateUserDialog from "./dialog/create-user-dialog";

export default function UsersManagementToolbar({
  search,
  roleFilter,
  onSearchChange,
  onRoleChange,
  refetch,
}: {
  search: string;
  roleFilter: string | null;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string | null) => void;
  refetch: () => void;
}) {
  // 🔹 Create User Dialog
  const [openCreateUser, setOpenCreateUser] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {["admin", "cashier", "kitchen"].map((role) => (
          <Button
            key={role}
            variant={roleFilter === role ? "default" : "outline"}
            onClick={() => {
              onRoleChange(roleFilter === role ? null : role);
            }}
            className="capitalize"
          >
            {role}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search user..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div>
          <Button onClick={() => setOpenCreateUser(true)}>
            <PlusIcon />
            Create User
          </Button>
          <CreateUserDialog
            open={openCreateUser}
            onOpenChange={setOpenCreateUser}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  );
}
