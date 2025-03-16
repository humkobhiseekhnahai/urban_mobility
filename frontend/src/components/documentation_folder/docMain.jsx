import { useState } from "react";
import { DocsSidebar } from "./doc-sidebar";
import { DocContent } from "./doc-content";
import { TableOfContents } from "./table-of-contents";

export default function DocsPage() {
  // State to track which section is currently active
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <div className="dark flex min-h-screen flex-col bg-background">
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        {/* Pass state and setter to sidebar */}
        <DocsSidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
          <div className="mx-auto w-full min-w-0">
            {/* Pass active section to content */}
            <DocContent activeSection={activeSection} />
          </div>
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 pt-10">
              {/* Pass active section to table of contents */}
              <TableOfContents activeSection={activeSection} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
