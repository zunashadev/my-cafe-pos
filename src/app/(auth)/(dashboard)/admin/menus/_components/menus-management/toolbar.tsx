import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PlusIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import CreateMenuDialog from "./dialog/create-menu-dialog";
import { MENU_CATEGORY } from "@/features/menu/constants";
// import CreateUserDialog from "./dialog/create-user-dialog";

export default function MenusManagementToolbar({
  search,
  categoryFilter,
  onSearchChange,
  onCategoryFilterChange,
}: {
  search: string;
  categoryFilter: string | null;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: string | null) => void;
}) {
  // 🔹 Create User Dialog
  const [openCreateMenu, setOpenCreateMenu] = useState(false);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {Object.values(MENU_CATEGORY).map((category) => (
          <Button
            key={category}
            variant={categoryFilter === category ? "default" : "outline"}
            onClick={() => {
              onCategoryFilterChange(
                categoryFilter === category ? null : category,
              );
            }}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <InputGroup>
          <InputGroupInput
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search menu..."
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div>
          <Button onClick={() => setOpenCreateMenu(true)}>
            <PlusIcon />
            Create Menu
          </Button>
          <CreateMenuDialog
            open={openCreateMenu}
            onOpenChange={setOpenCreateMenu}
          />
        </div>
      </div>
    </div>
  );
}
