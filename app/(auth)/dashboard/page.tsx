import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/vehicle/vehicle-card";
import { InsurancePolicy, UserProfile, Vehicle } from "@/types/data";
import { PolicyCard } from "@/components/policy/policy-card";
import { AccountCard } from "@/components/auth/profile-card";

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "2022 Toyota Camry",
    registration: "KDA288L",
    color: "White",
  },
  {
    id: "2",
    name: "2022 Toyota Axio",
    registration: "KDA288J",
    color: "Silver",
  },
  {
    id: "3",
    name: "2022 Volvo S60",
    registration: "KDA288J",
    color: "Black",
  },
];

const policies: InsurancePolicy[] = [
  {
    id: "1",
    vehicleName: "2022 Toyota Camry",
    registration: "KDA288L",
    insurer: "Safe Insurance",
    policyNumber: "POL-001-2024",
    coverage: "COMPREHENSIVE",
    premium: 20500,
    expiryDate: "2/15/2026",
    remainingDays: 319,
  },
  {
    id: "2",
    vehicleName: "2022 Toyota Axio",
    registration: "KDA288J",
    insurer: "Safe Insurance",
    policyNumber: "POL-001-2024",
    coverage: "THIRD PARTY",
    premium: 20500,
    expiryDate: "2/15/2026",
    remainingDays: 200,
  },
  {
    id: "3",
    vehicleName: "2022 Volvo S60",
    registration: "KDA288J",
    insurer: "Safe Insurance",
    policyNumber: "POL-001-2024",
    coverage: "COMPREHENSIVE",
    premium: 20500,
    expiryDate: "2/15/2026",
    remainingDays: 9,
  },
];

const user: UserProfile = {
  name: "Victor Nyangi",
  idNumber: "23454323",
  kraPin: "67373932",
  phoneNumber: "+254711223344",
  email: "mzenyangi@gmail.com",
};

export default async function Page() {
  return (
    <>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <h1 className="text-4xl font-bold text-center mb-12 text-foreground tracking-wide">
            Welcome
          </h1>

          <div className="gap-6 mb-8">
            <Card className="border border-border bg-card">
              <CardContent>
                <Tabs defaultValue="home" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4 bg-muted">
                    <TabsTrigger value="home" className="text-xs">
                      Home
                    </TabsTrigger>
                    <TabsTrigger value="vehicle" className="text-xs">
                      Vehicle
                    </TabsTrigger>
                    <TabsTrigger value="policies" className="text-xs">
                      Policies
                    </TabsTrigger>
                    <TabsTrigger value="profile" className="text-xs">
                      Profile
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="home" className="space-y-4">
                    <div className="border border-border rounded-lg p-4 bg-background/50">
                      <p className="text-sm text-foreground mb-3">
                        Welcome back, Kathurima
                      </p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Manage your vehicles and insurance policies all in one
                        place.
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border border-border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">
                          Total Vehicles
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">
                          5
                        </p>
                      </div>
                      <div className="border border-border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">
                          Active Policies
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">
                          2
                        </p>
                      </div>
                      <div className="border border-border rounded p-2 text-center">
                        <p className="text-xs text-muted-foreground">
                          Expiring Soon
                        </p>
                        <p className="text-sm font-semibold text-foreground mt-1">
                          1
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 border border-border rounded-lg p-4 bg-background/50">
                      <p className="text-xs font-semibold text-foreground">
                        Quick Actions
                      </p>
                      <div className="flex gap-2">
                        <button className="text-xs border border-border rounded px-3 py-1.5 text-foreground hover:bg-muted transition">
                          Add New Vehicle
                        </button>
                        <button className="text-xs border border-border rounded px-3 py-1.5 text-foreground hover:bg-muted transition">
                          View All Policies
                        </button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="vehicle">
                    <section className="min-h-screen px-6 py-8 text-black">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-8">
                        <h1 className="text-xl font-semibold tracking-wide">
                          Kathurima Vehicles
                        </h1>

                        <Button
                          variant="outline"
                          className="border-black text-black hover:bg-white/10"
                        >
                          Add Vehicle
                        </Button>
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
                        {vehicles.map((vehicle) => (
                          <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="policies">
                    <section className="min-h-screen px-6 py-8 text-black">
                      <h1 className="mb-6 text-xl font-semibold tracking-wide">
                        Insurance Policies
                      </h1>

                      <div className="space-y-6 max-w-6xl">
                        {policies.map((policy) => (
                          <PolicyCard key={policy.id} policy={policy} />
                        ))}
                      </div>
                    </section>
                  </TabsContent>

                  <TabsContent value="profile">
                    <AccountCard user={user} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
