import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PageBreadCrumb({
  pages,
}: {
  pages: { name: string; href: string; isActive?: boolean }[];
}) {
  return (
    <div className="mx-5">
      <Breadcrumb>
        <BreadcrumbList>
          {pages.map((page, index) => (
            <div key={page.href}>
              {!page.isActive ? (
                <div className="flex items-center gap-1">
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href={page.href}>{page.name}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {index < pages.length - 1 && <BreadcrumbSeparator />}
                </div>
              ) : (
                <BreadcrumbPage>{page.name}</BreadcrumbPage>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
