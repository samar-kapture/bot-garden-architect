import { NavLink, useLocation } from "react-router-dom";
import { Bot, Book, Folder } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Bot Library",
    url: "/",
    icon: Book,
    description: "Browse and manage your created bots"
  },
  {
    title: "Create Bot",
    url: "/create",
    icon: Bot,
    description: "Build new intelligent agents"
  },
  {
    title: "Flow Builder",
    url: "/flow",
    icon: Folder,
    description: "Arrange bots in graphical workflows"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-glow" 
      : "hover:bg-accent/50 hover:text-accent-foreground";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-72"} collapsible="icon">
      <SidebarContent className="bg-gradient-card border-r border-border">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                  Agent Builder
                </h1>
                <p className="text-xs text-muted-foreground">
                  Build intelligent agents
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="p-4">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground px-2 py-2 mb-3">
            {!isCollapsed ? "Navigation" : ""}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full p-0">
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => 
                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${getNavCls({ isActive })} ${isCollapsed ? 'justify-center' : ''}`
                      }
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-sm font-medium truncate">{item.title}</div>
                          <div className="text-xs text-muted-foreground opacity-75 truncate">{item.description}</div>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* API Status Indicator */}
        <div className="mt-auto p-6 border-t border-border">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">API Ready</span>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}