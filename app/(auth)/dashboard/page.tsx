import { ArrowUpRightIcon, FolderLockIcon } from "lucide-react";
import { PageBreadCrumb } from "@/components/PageBreadCrumb";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

export default async function Page() {
  const pages = [{ name: "Home", href: "/", isActive: false }];

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">Home</h2>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderLockIcon />
            </EmptyMedia>
            <EmptyTitle>No Data Yet</EmptyTitle>
            <EmptyDescription>
              Welcome to WHeelwise. Get started on payments.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button>Create Project</Button>
              <Button variant="outline">Import Project</Button>
            </div>
          </EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <a href="#">
              Learn More <ArrowUpRightIcon />
            </a>
          </Button>
        </Empty>
      </section>
    </>
  );
}
