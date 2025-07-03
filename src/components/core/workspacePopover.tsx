import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Workspace } from "../dashboard"


type WorkspaceComboBoxProps = {
  allWorkspaces: Workspace[]
  selectedWorkspace: Workspace | null
  setSelectedWorkspace: (workspace: Workspace) => void
}

export function WorkspaceComboBox({
  allWorkspaces,
  selectedWorkspace,
  setSelectedWorkspace,
}: WorkspaceComboBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between"
        >
          {selectedWorkspace ? selectedWorkspace.name : "Select workspace"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search workspaces..." />
          <CommandEmpty>No workspace found.</CommandEmpty>
          <CommandGroup>
            {allWorkspaces.map((workspace) => (
              <CommandItem
                key={workspace._id}
                value={workspace.name}
                onSelect={() => {
                  setSelectedWorkspace(workspace)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedWorkspace?._id === workspace._id
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {workspace.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
