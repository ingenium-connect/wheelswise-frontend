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
import Link from "next/link";

export default async function Page() {
  const pages = [{ name: "Dashboard", href: "/dashboard", isActive: true }];

  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-[#d7e8ee] via-white to-[#e5f0f3] py-12 px-4">
        <PageBreadCrumb pages={pages} />
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2e5e74]">Welcome</h2>
        </div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderLockIcon />
            </EmptyMedia>
            <EmptyTitle>Your Data</EmptyTitle>
            <EmptyDescription>
              Welcome to Wheelswise. Get started on payments.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/payment-summary">Payment Summary</Link>
              </Button>
            </div>
          </EmptyContent>
          <Button
            variant="link"
            asChild
            className="text-muted-foreground"
            size="sm"
          >
            <Link href="/">
              Go Home <ArrowUpRightIcon />
            </Link>
          </Button>
        </Empty>
      </section>
    </>
  );
}
