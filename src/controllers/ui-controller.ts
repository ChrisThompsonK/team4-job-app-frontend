interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "member";
  createdAt: Date;
}

interface NavigationItem {
  text: string;
  href: string;
  visible: boolean;
}

interface UserDisplayInfo {
  username: string;
  hasAdminBadge: boolean;
  adminBadgeText: string;
  adminBadgeClass: string;
}

interface HeaderState {
  navigation: NavigationItem[];
  userDisplay: UserDisplayInfo | null;
  isAuthenticated: boolean;
  showLoginButton: boolean;
  showLogoutButton: boolean;
}

// biome-ignore lint/complexity/noStaticOnlyClass: Utility class for UI state management
export class UiController {
  /**
   * Get navigation menu items based on user authentication and role
   */
  static getNavigationMenu(isAuthenticated: boolean, currentUser: User | null): NavigationItem[] {
    const baseNavigation: NavigationItem[] = [
      { text: "Home", href: "/", visible: true },
      { text: "Jobs", href: "/jobs", visible: true },
      { text: "About", href: "#", visible: true },
      { text: "Contact", href: "#", visible: true },
    ];

    // Add admin-only navigation items
    if (isAuthenticated && currentUser?.role === "admin") {
      baseNavigation.splice(2, 0, {
        text: "Create Job",
        href: "/jobs/create",
        visible: true,
      });
    }

    // Add member-only navigation items
    if (isAuthenticated && currentUser?.role === "member") {
      baseNavigation.splice(2, 0, {
        text: "View Applications",
        href: "/my-applications",
        visible: true,
      });
    }

    return baseNavigation;
  }

  /**
   * Get user display information for header
   */
  static getUserDisplayInfo(currentUser: User | null): UserDisplayInfo | null {
    if (!currentUser) {
      return null;
    }

    return {
      username: currentUser.username,
      hasAdminBadge: currentUser.role === "admin",
      adminBadgeText: "Admin",
      adminBadgeClass: "bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-1",
    };
  }

  /**
   * Get complete header state for templates
   */
  static getHeaderState(isAuthenticated: boolean, currentUser: User | null): HeaderState {
    return {
      navigation: UiController.getNavigationMenu(isAuthenticated, currentUser),
      userDisplay: UiController.getUserDisplayInfo(currentUser),
      isAuthenticated,
      showLoginButton: !isAuthenticated,
      showLogoutButton: isAuthenticated,
    };
  }
}
