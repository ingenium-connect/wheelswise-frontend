
import StepHeader from "@/components/layout/StepHeader";
import { ReactNode } from "react";

export default function Layout({children}: {children: ReactNode}) {
    return(
        <>
        <StepHeader />
        {children}
        </>
    )
}