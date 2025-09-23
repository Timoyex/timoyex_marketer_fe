import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Member, TeamStats } from "@/lib/api/team";

export interface TeamFilters {
  status?: "active" | "inactive" | "pending" | "all";
  level?: number;
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface TeamSorting {
  field: keyof Member;
  direction: "asc" | "desc";
}

export interface TeamPagination {
  page: number;
  pageSize: number;
  total: number;
}

interface TeamState {
  // Data stored as Maps for O(1) lookups and automatic deduplication
  directMembers: Map<string, Member>;
  downlineMembers: Map<string, Member>;
  teamStats: TeamStats | null;

  // UI State
  filters: TeamFilters;
  sorting: TeamSorting;
  pagination: TeamPagination;
  selectedMembers: Set<string>;

  // Current ref being viewed
  currentRef: string | null;
}

interface TeamActions {
  // State update actions (called from TanStack Query)
  updateDirectMembers: (members: Member[]) => void;
  updateDownlineMembers: (members: Member[]) => void;
  updateTeamStats: (stats: TeamStats) => void;
  setCurrentRef: (ref: string) => void;

  // UI State management
  setFilters: (filters: Partial<TeamFilters>) => void;
  clearFilters: () => void;
  setSorting: (sorting: TeamSorting) => void;
  toggleSortDirection: (field: keyof Member) => void;
  setPagination: (pagination: Partial<TeamPagination>) => void;
  goToPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;

  // Selection management
  selectMember: (memberId: string) => void;
  deselectMember: (memberId: string) => void;
  selectAllMembers: () => void;
  clearSelection: () => void;
  toggleMemberSelection: (memberId: string) => void;

  // Utilities
  reset: () => void;

  // Getters for arrays (computed from Maps)
  getDirectMembersArray: () => Member[];
  getDownlineMembersArray: () => Member[];
  getCurrentMembersArray: () => Member[];
}

type TeamStore = TeamState & TeamActions;

const initialState: TeamState = {
  // Data as Maps for O(1) lookups and automatic deduplication
  directMembers: new Map(),
  downlineMembers: new Map(),
  teamStats: null,

  // UI State
  filters: {},
  sorting: {
    field: "createdAt",
    direction: "desc",
  },
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
  selectedMembers: new Set(),

  // Current ref
  currentRef: null,
};

export const useTeamStore = create<TeamStore>()(
  devtools(
    subscribeWithSelector(
      immer((set, get) => ({
        ...initialState,

        // State update actions (called from TanStack Query)
        updateDirectMembers: (members: Member[]) => {
          set((state) => {
            // Clear existing and rebuild Map to ensure no duplicates
            state.directMembers.clear();

            members.forEach((member) => {
              state.directMembers.set(member.id, member);
            });
          });
        },

        updateDownlineMembers: (members: Member[]) => {
          set((state) => {
            // Clear existing and rebuild Map to ensure no duplicates
            state.downlineMembers.clear();

            members.forEach((member) => {
              state.downlineMembers.set(member.id, member);
            });
          });
        },

        updateTeamStats: (stats: TeamStats) => {
          set((state) => {
            state.teamStats = stats;
          });
        },

        setCurrentRef: (ref: string) => {
          set((state) => {
            state.currentRef = ref;
          });
        },

        // UI State management
        setFilters: (newFilters: Partial<TeamFilters>) => {
          set((state) => {
            state.filters = { ...state.filters, ...newFilters };
            state.pagination.page = 1; // Reset to first page when filtering
          });
        },

        clearFilters: () => {
          set((state) => {
            state.filters = {};
            state.pagination.page = 1;
          });
        },

        setSorting: (sorting: TeamSorting) => {
          set((state) => {
            state.sorting = sorting;
          });
        },

        toggleSortDirection: (field: keyof Member) => {
          set((state) => {
            if (state.sorting.field === field) {
              state.sorting.direction =
                state.sorting.direction === "asc" ? "desc" : "asc";
            } else {
              state.sorting.field = field;
              state.sorting.direction = "asc";
            }
          });
        },

        setPagination: (newPagination: Partial<TeamPagination>) => {
          set((state) => {
            state.pagination = { ...state.pagination, ...newPagination };
          });
        },

        goToPage: (page: number) => {
          set((state) => {
            state.pagination.page = page;
          });
        },

        setPageSize: (pageSize: number) => {
          set((state) => {
            state.pagination.pageSize = pageSize;
            state.pagination.page = 1; // Reset to first page when changing page size
          });
        },

        // Selection management
        selectMember: (memberId: string) => {
          set((state) => {
            state.selectedMembers.add(memberId);
          });
        },

        deselectMember: (memberId: string) => {
          set((state) => {
            state.selectedMembers.delete(memberId);
          });
        },

        selectAllMembers: () => {
          set((state) => {
            const currentMembers = Array.from(state.downlineMembers.values());

            currentMembers.forEach((member) => {
              state.selectedMembers.add(member.id);
            });
          });
        },

        clearSelection: () => {
          set((state) => {
            state.selectedMembers.clear();
          });
        },

        toggleMemberSelection: (memberId: string) => {
          set((state) => {
            if (state.selectedMembers.has(memberId)) {
              state.selectedMembers.delete(memberId);
            } else {
              state.selectedMembers.add(memberId);
            }
          });
        },

        // Utilities
        reset: () => {
          set(() => ({ ...initialState }));
        },

        // Getters for arrays (computed from Maps)
        getDirectMembersArray: () => {
          return Array.from(get().directMembers.values());
        },

        getDownlineMembersArray: () => {
          return Array.from(get().downlineMembers.values());
        },

        getCurrentMembersArray: () => {
          const state = get();
          return Array.from(state.downlineMembers.values());
        },
      }))
    ),
    {
      name: "team-store",
    }
  )
);

// Selectors for computed values with filtering and sorting
export const useFilteredAndSortedMembers = () => {
  return useTeamStore((state) => {
    const members = Array.from(state.downlineMembers.values());
    const { sorting, filters } = state;

    // Apply local filtering
    let filteredMembers = members;

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredMembers = filteredMembers.filter(
        (member) =>
          member.firstName.toLowerCase().includes(searchTerm) ||
          member.lastName.toLowerCase().includes(searchTerm) ||
          member.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status && filters.status !== "all") {
      filteredMembers = filteredMembers.filter(
        (member) => member.status === filters.status
      );
    }

    if (filters.level) {
      filteredMembers = filteredMembers.filter(
        (member) => member.level === filters.level
      );
    }

    // Apply sorting
    filteredMembers.sort((a, b) => {
      const aValue = a[sorting.field]!;
      const bValue = b[sorting.field]!;

      if (aValue < bValue) return sorting.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filteredMembers;
  });
};

export const usePaginatedMembers = () => {
  const filteredMembers = useFilteredAndSortedMembers();

  return useTeamStore((state) => {
    const { page, pageSize } = state.pagination;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return filteredMembers.slice(startIndex, endIndex);
  });
};

export const useTeamStoreSelectors = () => ({
  // Current data based on view mode
  currentMembers: useTeamStore((state) =>
    Array.from(state.downlineMembers.values())
  ),

  // Data counts
  directMembersCount: useTeamStore((state) => state.directMembers.size),
  downlineMembersCount: useTeamStore((state) => state.downlineMembers.size),

  // Selection helpers
  selectedCount: useTeamStore((state) => state.selectedMembers.size),
  hasSelection: useTeamStore((state) => state.selectedMembers.size > 0),

  // Pagination helpers
  totalPages: useTeamStore((state) =>
    Math.ceil(state.pagination.total / state.pagination.pageSize)
  ),

  canGoNext: useTeamStore(
    (state) =>
      state.pagination.page <
      Math.ceil(state.pagination.total / state.pagination.pageSize)
  ),

  canGoPrevious: useTeamStore((state) => state.pagination.page > 1),
});
