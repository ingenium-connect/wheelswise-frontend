import {} from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Dialog,
  DialogHeader,
  DialogClose,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { axiosAuthClient } from "@/utilities/axios-client";
import { LucideCheckCircle, LucideLoaderCircle } from "lucide-react";
import { UnderwriterValuer } from "@/types/data";
import { toast } from "sonner";

export function ValuersList({
  underwriterId,
  policyId,
}: {
  underwriterId: string | undefined;
  policyId: string;
}) {
  const [valuers, setValuers] = useState<UnderwriterValuer[] | null>(null);
  const [selectedValuer, setSelectedValuer] = useState<string>();
  useEffect(() => {
    axiosAuthClient
      .get(`/policy/valuers?underwriter_id=${underwriterId}`)
      .then((res) => {
        setValuers(res.data.valuers);
      })
      .catch((err) => {
        setValuers([]);
      });
  }, []);

  const persistSelectedValuer = () => {
    axiosAuthClient
      .post("/policy/valuation-request", {
        policy_id: policyId,
        valuer_id: selectedValuer,
      })
      .then(() => {
        toast.success("Valuer selection successful.");
      })
      .catch(() => {
        toast.error("An error occurred please try again");
      });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Check Valuers</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm md:w-7lg">
        <DialogHeader>
          <DialogTitle>List of Valuers</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {valuers ? (
            valuers.length > 0 ? (
              <div className="flex flex-col gap-2">
                <p>Select a valuer to proceed with valuation</p>
                <hr />
                {valuers.map((valuer) => (
                  <div
                    key={valuer.id}
                    className={`flex justify-between items-center p-2 hover:bg-primary/40 cursor-pointer rounded-md ${selectedValuer === valuer.id && "border-primary border"} `}
                    onClick={() => setSelectedValuer(valuer.id)}
                  >
                    <div>
                      <p>{valuer.name}</p>
                      <p>{valuer.location}</p>
                    </div>
                    {selectedValuer === valuer.id && (
                      <LucideCheckCircle className="text-primary" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No valuers for this underwriter</p>
            )
          ) : (
            <div className="flex flex-col items-center justify-center">
              Fetching Valuers...
              <LucideLoaderCircle className="animate-spin" />
            </div>
          )}
        </div>
        <Button onClick={persistSelectedValuer}>Confirm</Button>
      </DialogContent>
    </Dialog>
  );
}
