import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AISummarySection } from "./AISummarySection";

interface Props {
  onOpenChat?: (q: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

const householdMembers = [
  { name: "Rick Sweets", company: "Retired (Eng. Director)", birthday: "07/22/1958 (67)", relation: "Husband" },
  { name: "Karen Sweets", company: "Retired (RN)", birthday: "03/14/1962 (64)", relation: "Wife" },
];

export function HouseholdSummaryDashboard({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: Props) {
  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            title="Household Summary — Sweets"
            onClose={onToggleAISummary}
            onOpenChat={onOpenChat}
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Sweets household: Rick & Karen, household estimated net worth{" "}
                  <span className="font-bold">$1M-$5M</span>.
                </li>
                <li>
                  TIER 1 client at Schwab — <span className="font-bold">annual review</span> cadence,
                  income range <span className="font-bold">$250K-$500K</span>.
                </li>
                <li>
                  Last review: <span className="font-bold">02/14/2026</span> · Last touch point:{" "}
                  <span className="font-bold">05/02/2026</span>.
                </li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">Household Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-x-12 gap-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Client Since:</div>
                  <div className="text-sm">2012</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Last Review:</div>
                  <div className="text-sm">02/14/2026</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Liquid Net Worth:</div>
                  <div className="text-sm">$ 1M - 5M</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Category:</div>
                  <div className="text-sm">TIER 1 (Schwab)</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Next Scheduled Review:</div>
                  <div className="text-sm">06/22/2026 (today)</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Estimated Net Worth:</div>
                  <div className="text-sm">$ 1M - 5M</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Type:</div>
                  <div className="text-sm">Retired Couple</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Last Touch Point:</div>
                  <div className="text-sm">05/02/2026</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Household Income:</div>
                  <div className="text-sm">$ 250K - 500K</div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Review Frequency:</div>
                  <div className="text-sm">Annual</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Type of Touch Point:</div>
                  <div className="text-sm">Phone call</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Tax Bracket:</div>
                  <div className="text-sm">24%</div>
                </div>

                <div className="col-span-3 mt-2">
                  <div className="text-sm text-muted-foreground mb-1">Address:</div>
                  <div className="text-sm">
                    84 Linden Hill Rd.
                    <br />
                    Lancaster, MA 01523 United States
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-medium">People in Household</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Birthday (Age)</TableHead>
                    <TableHead>Relation to Household</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {householdMembers.map((member, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.company}</TableCell>
                      <TableCell>{member.birthday}</TableCell>
                      <TableCell>{member.relation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
