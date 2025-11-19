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
            <BreadcrumbItem key={page.href}>
              {!page.isActive ? (
                <>
                  <BreadcrumbLink asChild>
                    <Link href={page.href}>{page.name}</Link>
                  </BreadcrumbLink>
                  {index < pages.length - 1 && <BreadcrumbSeparator />}
                </>
              ) : (
                <BreadcrumbPage>{page.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
