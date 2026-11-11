import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AISummarySection } from "./AISummarySection";

interface BeneficiaryReviewDashboardProps {
  onOpenChat?: (question: string) => void;
  className?: string;
  isAISummaryVisible?: boolean;
  onToggleAISummary?: () => void;
  [key: string]: any;
}

const beneficiaryData = [
  {
    name: "Schwab IRA (xxxx7886) — Rick Sweets",
    indicator: "",
    share: "",
    status: "",
    spouse: "",
    ssn: "",
    dateOfBirth: "",
    perStirpes: "",
    establishment: "",
    isHeader: true,
  },
  {
    name: "Karen Sweets",
    indicator: "Primary",
    share: "100.00%",
    status: "Valid",
    spouse: "Yes",
    ssn: "XXXXX1080",
    dateOfBirth: "03/14/1962",
    perStirpes: "N",
    establishment: "",
  },
  {
    name: "Schwab Roth IRA (xxxx7319) — Karen Sweets",
    indicator: "",
    share: "",
    status: "",
    spouse: "",
    ssn: "",
    dateOfBirth: "",
    perStirpes: "",
    establishment: "",
    isHeader: true,
  },
  {
    name: "Rick Sweets",
    indicator: "Primary",
    share: "100.00%",
    status: "Valid",
    spouse: "Yes",
    ssn: "XXXXX6931",
    dateOfBirth: "07/22/1958",
    perStirpes: "N",
    establishment: "",
  },
  {
    name: "Sweets Family Trust",
    indicator: "Contingent",
    share: "100.00%",
    status: "Valid",
    spouse: "N/A",
    ssn: "XXXXX1080",
    dateOfBirth: "06/14/2020",
    perStirpes: "Y",
    establishment: "06/14/2020",
  },
];

const insuranceData = [
  {
    policyNickname: "Rick Sweets — Term Life",
    company: "",
    policyNumber: "",
    deathBenefit: "",
    primaryBeneficiary: "",
    contingentBeneficiary: "",
    policyType: "",
    policyDate: "",
    isHeader: true,
  },
  {
    policyNickname: "",
    company: "Northwestern Mutual",
    policyNumber: "XXXXXX7702",
    deathBenefit: "500,000.00",
    primaryBeneficiary: "Karen Sweets",
    contingentBeneficiary: "Sweets Family Trust",
    policyType: "Term Life",
    policyDate: "03/01/2018",
  },
  {
    policyNickname: "Karen Sweets — Whole Life",
    company: "",
    policyNumber: "",
    deathBenefit: "",
    primaryBeneficiary: "",
    contingentBeneficiary: "",
    policyType: "",
    policyDate: "",
    isHeader: true,
  },
  {
    policyNickname: "",
    company: "MassMutual",
    policyNumber: "XXXXXX4418",
    deathBenefit: "250,000.00",
    primaryBeneficiary: "Rick Sweets",
    contingentBeneficiary: "Sweets Family Trust",
    policyType: "Whole Life",
    policyDate: "06/01/2010",
  },
];

export const BeneficiaryReviewDashboard = ({
  onOpenChat,
  className,
  isAISummaryVisible = true,
  onToggleAISummary,
}: BeneficiaryReviewDashboardProps) => {
  return (
    <div className={`overflow-y-auto bg-background ${className || "flex-1"}`}>
      <div className="p-8 space-y-6 px-[20px] pb-[20px] pt-0">
        {isAISummaryVisible && (
          <AISummarySection
            onOpenChat={onOpenChat}
            onClose={onToggleAISummary}
            title="Beneficiary Review Summary"
            summary={
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Rick and Karen each designate the other as <span className="font-bold">100%
                  primary</span> on their Schwab IRA / Roth IRA, with the Sweets Family Trust as
                  contingent.
                </li>
                <li>
                  Total life insurance death benefit on file:{" "}
                  <span className="font-bold">$750,000.00</span> across two policies.
                </li>
                <li>All beneficiary designations are current and aligned with the estate plan.</li>
              </ul>
            }
          />
        )}

        <div className="space-y-6">
          <Card className="p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-foreground">Beneficiary Name</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Beneficiary<br />Indicator
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Share</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Status</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Spouse<br />Indicator
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">SSN</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Date of Birth/<br />Trust Date
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Per Stirpes</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Establishment<br />Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficiaryData.map((row, index) => (
                    <TableRow
                      key={index}
                      className={row.isHeader ? "bg-muted/30" : "hover:bg-muted/30"}
                    >
                      <TableCell
                        className={`whitespace-nowrap ${row.isHeader ? "font-semibold" : ""}`}
                      >
                        {row.name}
                      </TableCell>
                      <TableCell className="text-center">{row.indicator}</TableCell>
                      <TableCell className="text-center">{row.share}</TableCell>
                      <TableCell className="text-center">{row.status}</TableCell>
                      <TableCell className="text-center">{row.spouse}</TableCell>
                      <TableCell className="text-center">{row.ssn}</TableCell>
                      <TableCell className="text-center">{row.dateOfBirth}</TableCell>
                      <TableCell className="text-center">{row.perStirpes}</TableCell>
                      <TableCell className="text-center">{row.establishment}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Insurance / Annuity Details
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-foreground">Policy Nickname</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Company</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">Policy #</TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Death Benefit ($)
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Primary Beneficiary
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Contingent Beneficiary
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Policy Type
                    </TableHead>
                    <TableHead className="font-semibold text-foreground text-center">
                      Policy Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insuranceData.map((row, index) => (
                    <TableRow
                      key={index}
                      className={row.isHeader ? "bg-muted/30" : "hover:bg-muted/30"}
                    >
                      <TableCell className={row.isHeader ? "font-semibold" : ""}>
                        {row.policyNickname}
                      </TableCell>
                      <TableCell className="text-center">{row.company}</TableCell>
                      <TableCell className="text-center">{row.policyNumber}</TableCell>
                      <TableCell className="text-center">{row.deathBenefit}</TableCell>
                      <TableCell className="text-center">{row.primaryBeneficiary}</TableCell>
                      <TableCell className="text-center">{row.contingentBeneficiary}</TableCell>
                      <TableCell className="text-center">{row.policyType}</TableCell>
                      <TableCell className="text-center">{row.policyDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
