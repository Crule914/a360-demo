// @ts-nocheck
import jsPDF from 'jspdf';
import type { ClientData } from '@miq/types/advisor';
import type { AgendaSectionLite } from '@miq/components/canvas/utils/generateAgendaSections';
import { ClientContentService } from '@miq/data/clientSpecificData';
import { formatCurrency } from '@miq/utils/formatters';

interface ExpansionData {
  title: string;
  overview: Array<{ label: string; value: string; highlight?: boolean }>;
  milestones: Array<{ task: string; status: string }>;
  recommendations: string[];
}

const getExpansionData = (sectionId: string, bulletIndex: number, client: ClientData): ExpansionData | null => {
  if (sectionId === 'meeting-overview') return null; // No expansion for overview

  if (sectionId === 'planning-goals') {
    const retirementData = ClientContentService.getRetirementData(client.id) || {
      currentSavings: 845000, targetAmount: 1500000, monthlyContribution: 3200,
      projectedRetirementAge: 62, yearsToRetirement: 12
    };
    const data: Record<number, ExpansionData> = {
      0: {
        title: 'Retirement Timeline Analysis',
        overview: [
          { label: 'Target Age', value: '62 years' },
          { label: 'Current Assets', value: formatCurrency(retirementData.currentSavings) },
          { label: 'Projected at 62', value: formatCurrency(retirementData.targetAmount), highlight: true },
          { label: 'Income Replacement', value: '85%' }
        ],
        milestones: [
          { task: 'Maximum 401(k) contributions', status: 'completed' },
          { task: 'Catch-up contributions at 50', status: 'completed' },
          { task: 'Social Security optimization at 62', status: 'pending' }
        ],
        recommendations: ['Continue maximum contributions', 'Consider Roth conversions in low-income years', 'Review Social Security timing strategy', 'Plan healthcare coverage bridge']
      },
      1: {
        title: 'College Savings Analysis',
        overview: [
          { label: 'Target Goal', value: '$180K by 2029' },
          { label: 'Current Balance', value: '$85K' },
          { label: 'Monthly Contribution', value: '$1,200', highlight: true },
          { label: 'Progress', value: '47%' }
        ],
        milestones: [
          { task: '529 plan established', status: 'completed' },
          { task: 'Monthly contributions automated', status: 'completed' },
          { task: 'Investment allocation optimized', status: 'pending' }
        ],
        recommendations: ['Increase contributions by $200/month', 'Consider gift tax strategies', 'Review investment allocation', 'Plan for multiple children timing']
      },
      2: {
        title: 'Emergency Fund Analysis',
        overview: [
          { label: 'Target Amount', value: '$42K' },
          { label: 'Current Balance', value: '$38K' },
          { label: 'Months Coverage', value: '5.5 months', highlight: true },
          { label: 'Goal Progress', value: '90%' }
        ],
        milestones: [
          { task: 'High-yield savings established', status: 'completed' },
          { task: 'Automatic transfers set up', status: 'completed' },
          { task: 'Reach 6-month target', status: 'pending' }
        ],
        recommendations: ['Add final $4K to reach target', 'Review expense categories quarterly', 'Consider HYSA rate optimization', 'Plan for income changes']
      }
    };
    return data[bulletIndex] || null;
  }

  if (sectionId === 'portfolio-performance') {
    const clientContent = ClientContentService.getPortfolioPerformanceData(client.id);
    const ytdReturn = clientContent?.ytdReturn || client.keyMetrics?.yearToDateReturn || 8.4;
    const benchmarkReturn = clientContent?.benchmarkReturn || 7.2;
    const outperformance = ytdReturn - benchmarkReturn;
    const data: Record<number, ExpansionData> = {
      0: {
        title: 'YTD Performance Analysis',
        overview: [
          { label: 'YTD Return', value: `+${ytdReturn.toFixed(1)}%`, highlight: true },
          { label: 'Benchmark', value: `+${benchmarkReturn.toFixed(1)}%` },
          { label: 'Alpha Generated', value: `+${outperformance.toFixed(1)}%` },
          { label: 'Value Added', value: formatCurrency(Math.round(client.householdAssets * outperformance / 100)) }
        ],
        milestones: [
          { task: 'Outperform benchmark', status: 'completed' },
          { task: 'Maintain risk targets', status: 'completed' },
          { task: 'Quarterly rebalancing', status: 'pending' }
        ],
        recommendations: ['Continue current allocation strategy', 'Monitor sector concentration', 'Consider international rebalancing', 'Review tax-loss opportunities']
      },
      1: {
        title: 'Portfolio Rebalancing Analysis',
        overview: [
          { label: 'Last Rebalance', value: '3 months ago' },
          { label: 'Drift Amount', value: '2.8%' },
          { label: 'Target Variance', value: '±5%', highlight: true },
          { label: 'Recommended Action', value: 'Minor adjust' }
        ],
        milestones: [
          { task: 'Reduce tech allocation 28% → 22%', status: 'completed' },
          { task: 'Increase international to 25%', status: 'completed' },
          { task: 'Bond duration adjustment', status: 'pending' }
        ],
        recommendations: ['Reduce domestic equity by 3%', 'Increase international allocation', 'Maintain bond duration at 4.2 years', 'Consider emerging markets exposure']
      },
      2: {
        title: 'Bond Duration Analysis',
        overview: [
          { label: 'Current Duration', value: '4.2 years' },
          { label: 'Target Duration', value: '4.0 years' },
          { label: 'Yield', value: '4.8%', highlight: true },
          { label: 'Quality', value: 'AA average' }
        ],
        milestones: [
          { task: 'Shortened duration from 5.1yr', status: 'completed' },
          { task: 'TIPS allocation added', status: 'completed' },
          { task: 'Review municipal bond exposure', status: 'pending' }
        ],
        recommendations: ['Maintain short duration bias', 'Add TIPS for inflation protection', 'Review municipal bond opportunities', 'Monitor rate curve changes']
      },
      3: {
        title: 'International Diversification',
        overview: [
          { label: 'Current Allocation', value: '25%' },
          { label: 'Previous', value: '18%' },
          { label: 'Target', value: '25%', highlight: true },
          { label: 'Regions', value: '4 markets' }
        ],
        milestones: [
          { task: 'Increased from 18% to 25%', status: 'completed' },
          { task: 'Added developed markets ETFs', status: 'completed' },
          { task: 'Evaluate emerging markets', status: 'pending' }
        ],
        recommendations: ['Maintain 25% international target', 'Consider emerging markets 5%', 'Monitor currency hedging needs', 'Review regional allocations']
      }
    };
    return data[bulletIndex] || null;
  }

  if (sectionId === 'next-actions') {
    const data: Record<number, ExpansionData> = {
      0: {
        title: 'Beneficiary Review',
        overview: [
          { label: 'Total Accounts', value: '4' },
          { label: 'Need Updates', value: '2', highlight: true },
          { label: 'Up to Date', value: '2' },
          { label: 'Coverage', value: '100%' }
        ],
        milestones: [
          { task: 'Primary beneficiaries current', status: 'completed' },
          { task: 'Add contingent beneficiaries', status: 'pending' },
          { task: 'Update life insurance forms', status: 'pending' }
        ],
        recommendations: ['Update life insurance immediately', 'Add 401k contingent beneficiaries', 'Schedule annual review process', 'Coordinate with estate attorney']
      },
      1: {
        title: '401(k) Contribution Analysis',
        overview: [
          { label: 'Current Rate', value: '12%' },
          { label: 'Recommended', value: '15%', highlight: true },
          { label: 'Employer Match', value: '6%' },
          { label: 'Annual Increase', value: '$3,600' }
        ],
        milestones: [
          { task: 'Maximize employer match', status: 'completed' },
          { task: 'Increase to 15% rate', status: 'pending' },
          { task: 'Enable catch-up at 50', status: 'pending' }
        ],
        recommendations: ['Increase contribution to 15%', 'Schedule HR meeting', 'Plan for catch-up contributions', 'Review vesting schedule']
      },
      2: {
        title: 'Insurance Review',
        overview: [
          { label: 'Life Insurance', value: '$1M term' },
          { label: 'Disability', value: '60% income' },
          { label: 'Umbrella', value: '$2M', highlight: true },
          { label: 'Last Review', value: '18 months' }
        ],
        milestones: [
          { task: 'Term life adequate', status: 'completed' },
          { task: 'Disability coverage review', status: 'pending' },
          { task: 'Umbrella policy update', status: 'pending' }
        ],
        recommendations: ['Schedule annual insurance review', 'Evaluate disability gap', 'Consider umbrella increase', 'Review beneficiary alignment']
      },
      3: {
        title: 'Roth Conversion Opportunity',
        overview: [
          { label: 'Conversion Amount', value: '$25,000' },
          { label: 'Tax Cost', value: '~$6,000' },
          { label: 'Tax Bracket', value: '24%', highlight: true },
          { label: 'Breakeven', value: '8 years' }
        ],
        milestones: [
          { task: 'Tax bracket analysis', status: 'completed' },
          { task: 'Conversion modeling', status: 'completed' },
          { task: 'Execute conversion', status: 'pending' }
        ],
        recommendations: ['Convert $25K before year-end', 'Pay tax from non-retirement assets', 'Model multi-year conversion ladder', 'Coordinate with CPA']
      }
    };
    return data[bulletIndex] || null;
  }

  return null;
};

export const generateAgendaPdf = (client: ClientData, sections: AgendaSectionLite[]) => {
  const doc = new jsPDF('p', 'mm', 'letter');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header bar
  doc.setFillColor(30, 58, 138);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Meeting Agenda', margin, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Prepared for ${client.name}`, pageWidth - margin, 12, { align: 'right' });

  const meetingDate = client.nextMeeting ? new Date(client.nextMeeting) : new Date();
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
  doc.text(formattedDate, pageWidth - margin, 18, { align: 'right' });

  y = 38;

  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  const meetingTime = client.nextMeetingDetails?.time || '10:00 AM';
  const locationType = client.nextMeetingDetails?.location?.type || 'office';
  const locationLabel = locationType === 'virtual' ? 'Virtual' : locationType === 'client_location' ? 'Client Location' : 'Office';
  const advisorName = (client as any).advisor || 'Financial Advisor';
  doc.text(`Time: ${meetingTime}  •  Location: ${locationLabel}  •  Advisor: ${advisorName}`, margin, y);
  y += 10;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Helper to estimate the height a talking point + its expansion will need
  const estimateBulletHeight = (bullet: any, section: AgendaSectionLite, bulletIndex: number): number => {
    let est = 0;
    // Bullet text
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(`•  ${bullet.content}`, contentWidth - 10);
    est += lines.length * 5 + 2;

    // Expansion content estimate
    if (bullet.expansionComponentType) {
      const expansion = getExpansionData(section.id, bulletIndex, client);
      if (expansion) {
        est += 5; // title
        est += 12; // overview metrics
        // chart
        const chartFn = getChartForSection(section.id, bulletIndex);
        if (chartFn) est += 45;
        // milestones
        est += expansion.milestones.length * 5 + 4;
        // recommendations
        expansion.recommendations.forEach(rec => {
          doc.setFontSize(8);
          const recLines = doc.splitTextToSize(rec, contentWidth - 25);
          est += recLines.length * 4;
        });
        est += 7; // padding
      }
    }
    return est;
  };

  // Render sections
  sections.forEach((section, sectionIndex) => {
    // Each topic starts on a new page (except first and second sections)
    if (sectionIndex > 1) {
      doc.addPage();
      y = margin;
    }

    // Section header
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(`${sectionIndex + 1}. ${section.title}`, margin, y);
    y += 6;

    // AI Summary
    if (section.aiSummary) {
      checkPageBreak(12);
      doc.setTextColor(120, 120, 120);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      const summaryLines = doc.splitTextToSize(section.aiSummary, contentWidth - 5);
      doc.text(summaryLines, margin + 5, y);
      y += summaryLines.length * 4 + 2;
    }

    // No data notice
    if (section.noDataAvailable && section.bullets.length === 0) {
      checkPageBreak(10);
      doc.setFillColor(255, 249, 235);
      doc.roundedRect(margin + 3, y - 3, contentWidth - 6, 10, 2, 2, 'F');
      doc.setTextColor(180, 130, 30);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('No data available — upload documents to generate talking points', margin + 8, y + 3);
      y += 14;
    }

    // Bullets with expansion content
    section.bullets.forEach((bullet, bulletIndex) => {
      // Estimate total height for this talking point
      const neededHeight = estimateBulletHeight(bullet, section, bulletIndex);
      const remainingOnPage = pageHeight - margin - y;

      // If it won't fit and there's meaningful content already on the page, start a new page
      if (neededHeight > remainingOnPage && y > margin + 20) {
        doc.addPage();
        y = margin;
      }

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const bulletText = `•  ${bullet.content}`;
      const lines = doc.splitTextToSize(bulletText, contentWidth - 10);
      doc.text(lines, margin + 5, y);
      y += lines.length * 5 + 2;

      // Expansion content
      if (bullet.expansionComponentType) {
        const expansion = getExpansionData(section.id, bulletIndex, client);
        if (expansion) {
          renderExpansionContent(doc, expansion, margin, contentWidth, pageHeight, () => {
            checkPageBreak(0);
            return y;
          }, (newY: number) => { y = newY; }, section.id, bulletIndex);
        }
      }
    });

    // No section divider needed since each topic starts on a new page
  });

  // Footer
  const totalTime = sections.reduce((sum, s) => sum + s.timeAllocation, 0);
  checkPageBreak(16);
  y += 4;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total estimated time: ${totalTime} minutes`, margin, y);
  doc.text(`Generated ${new Date().toLocaleDateString('en-US')}`, pageWidth - margin, y, { align: 'right' });

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
  }

  const sanitizedName = client.name.replace(/\s+/g, '');
  doc.save(`${sanitizedName}_Agenda.pdf`);
};

// ── Chart drawing helpers ──

interface ChartDataPoint { [key: string]: string | number }

const CHART_COLORS = {
  primary: [30, 58, 138] as [number, number, number],
  secondary: [99, 102, 241] as [number, number, number],
  accent: [34, 197, 94] as [number, number, number],
  orange: [249, 115, 22] as [number, number, number],
  grid: [220, 220, 220] as [number, number, number],
  axis: [150, 150, 150] as [number, number, number],
  label: [100, 100, 100] as [number, number, number],
};

function drawChartAxes(doc: jsPDF, x: number, y: number, w: number, h: number, gridCount = 4) {
  doc.setDrawColor(...CHART_COLORS.grid);
  doc.setLineWidth(0.15);
  for (let i = 0; i <= gridCount; i++) {
    const gy = y + (h / gridCount) * i;
    doc.line(x, gy, x + w, gy);
  }
  doc.setDrawColor(...CHART_COLORS.axis);
  doc.setLineWidth(0.3);
  doc.line(x, y + h, x + w, y + h); // x-axis
  doc.line(x, y, x, y + h); // y-axis
}

function drawLineChart(
  doc: jsPDF,
  data: ChartDataPoint[],
  xKey: string,
  yKey: string,
  chartX: number,
  chartY: number,
  chartW: number,
  chartH: number,
  color: [number, number, number],
  yFormatter: (v: number) => string
) {
  const values = data.map(d => Number(d[yKey]));
  const minV = Math.min(...values) * 0.9;
  const maxV = Math.max(...values) * 1.05;
  const range = maxV - minV || 1;

  drawChartAxes(doc, chartX, chartY, chartW, chartH);

  // Y-axis labels
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...CHART_COLORS.label);
  for (let i = 0; i <= 4; i++) {
    const val = minV + (range / 4) * (4 - i);
    const ly = chartY + (chartH / 4) * i;
    doc.text(yFormatter(val), chartX - 2, ly + 1.5, { align: 'right' });
  }

  // X-axis labels & data points
  const points: [number, number][] = [];
  data.forEach((d, i) => {
    const px = chartX + (i / (data.length - 1)) * chartW;
    const py = chartY + chartH - ((Number(d[yKey]) - minV) / range) * chartH;
    points.push([px, py]);
    doc.setTextColor(...CHART_COLORS.label);
    doc.setFontSize(6);
    doc.text(String(d[xKey]), px, chartY + chartH + 4, { align: 'center' });
  });

  // Line
  doc.setDrawColor(...color);
  doc.setLineWidth(0.6);
  for (let i = 1; i < points.length; i++) {
    doc.line(points[i - 1][0], points[i - 1][1], points[i][0], points[i][1]);
  }

  // Dots
  doc.setFillColor(...color);
  points.forEach(([px, py]) => doc.circle(px, py, 1.2, 'F'));
}

function drawBarChart(
  doc: jsPDF,
  data: ChartDataPoint[],
  xKey: string,
  yKeys: string[],
  chartX: number,
  chartY: number,
  chartW: number,
  chartH: number,
  colors: [number, number, number][],
  yFormatter: (v: number) => string,
  yDomain?: [number, number]
) {
  const allVals = data.flatMap(d => yKeys.map(k => Number(d[k])));
  const maxV = yDomain ? yDomain[1] : Math.max(...allVals) * 1.1;
  const minV = yDomain ? yDomain[0] : 0;
  const range = maxV - minV || 1;

  drawChartAxes(doc, chartX, chartY, chartW, chartH);

  // Y-axis labels
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...CHART_COLORS.label);
  for (let i = 0; i <= 4; i++) {
    const val = minV + (range / 4) * (4 - i);
    const ly = chartY + (chartH / 4) * i;
    doc.text(yFormatter(val), chartX - 2, ly + 1.5, { align: 'right' });
  }

  const groupW = chartW / data.length;
  const barW = (groupW * 0.6) / yKeys.length;
  const gap = groupW * 0.2;

  data.forEach((d, di) => {
    const groupX = chartX + di * groupW + gap;
    yKeys.forEach((key, ki) => {
      const val = Number(d[key]);
      const barH = ((val - minV) / range) * chartH;
      const bx = groupX + ki * barW;
      const by = chartY + chartH - barH;
      doc.setFillColor(...colors[ki % colors.length]);
      doc.rect(bx, by, barW - 1, barH, 'F');
    });
    doc.setTextColor(...CHART_COLORS.label);
    doc.setFontSize(6);
    const labelX = groupX + (yKeys.length * barW) / 2;
    doc.text(String(d[xKey]), labelX, chartY + chartH + 4, { align: 'center' });
  });
}

function drawMultiLineChart(
  doc: jsPDF,
  data: ChartDataPoint[],
  xKey: string,
  lines: { key: string; color: [number, number, number]; label: string }[],
  chartX: number,
  chartY: number,
  chartW: number,
  chartH: number,
  yDomain: [number, number]
) {
  const [minV, maxV] = yDomain;
  const range = maxV - minV;

  drawChartAxes(doc, chartX, chartY, chartW, chartH);

  // Y-axis labels
  doc.setFontSize(6);
  doc.setTextColor(...CHART_COLORS.label);
  for (let i = 0; i <= 4; i++) {
    const val = minV + (range / 4) * (4 - i);
    doc.text(`${Math.round(val)}%`, chartX - 2, chartY + (chartH / 4) * i + 1.5, { align: 'right' });
  }

  // X-axis labels
  data.forEach((d, i) => {
    const px = chartX + (i / (data.length - 1)) * chartW;
    doc.text(String(d[xKey]), px, chartY + chartH + 4, { align: 'center' });
  });

  // Lines
  lines.forEach((line) => {
    const pts: [number, number][] = data.map((d, i) => {
      const px = chartX + (i / (data.length - 1)) * chartW;
      const py = chartY + chartH - ((Number(d[line.key]) - minV) / range) * chartH;
      return [px, py];
    });
    doc.setDrawColor(...line.color);
    doc.setLineWidth(0.5);
    for (let i = 1; i < pts.length; i++) doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
    doc.setFillColor(...line.color);
    pts.forEach(([px, py]) => doc.circle(px, py, 1, 'F'));
  });

  // Legend
  let lx = chartX;
  doc.setFontSize(6);
  lines.forEach((line) => {
    doc.setFillColor(...line.color);
    doc.rect(lx, chartY + chartH + 7, 4, 2, 'F');
    doc.setTextColor(...CHART_COLORS.label);
    doc.text(line.label, lx + 5, chartY + chartH + 9);
    lx += 25;
  });
}

function getChartForSection(sectionId: string, bulletIndex: number): ((doc: jsPDF, x: number, y: number, w: number, h: number) => void) | null {
  if (sectionId === 'planning-goals') {
    if (bulletIndex === 0) {
      return (doc, x, y, w, h) => drawLineChart(doc,
        [{ year: 2024, amount: 845000 }, { year: 2026, amount: 950000 }, { year: 2028, amount: 1080000 }, { year: 2030, amount: 1230000 }, { year: 2032, amount: 1410000 }, { year: 2034, amount: 1620000 }],
        'year', 'amount', x, y, w, h, CHART_COLORS.primary, v => `$${Math.round(v / 1000)}K`
      );
    }
    if (bulletIndex === 1) {
      return (doc, x, y, w, h) => drawLineChart(doc,
        [{ year: 2024, amount: 85000 }, { year: 2025, amount: 99400 }, { year: 2026, amount: 113800 }, { year: 2027, amount: 128200 }, { year: 2028, amount: 142600 }, { year: 2029, amount: 157000 }],
        'year', 'amount', x, y, w, h, CHART_COLORS.primary, v => `$${Math.round(v / 1000)}K`
      );
    }
    if (bulletIndex === 2) {
      return (doc, x, y, w, h) => drawBarChart(doc,
        [{ category: 'Current', months: 4.5 }, { category: 'Target', months: 6 }],
        'category', ['months'], x, y, w, h, [CHART_COLORS.primary], v => `${v.toFixed(1)}mo`, [0, 7]
      );
    }
  }

  if (sectionId === 'portfolio-performance') {
    if (bulletIndex === 0) {
      return (doc, x, y, w, h) => drawBarChart(doc,
        [{ category: 'US Stocks', before: 65, after: 60 }, { category: 'Intl Stocks', before: 20, after: 25 }, { category: 'Bonds', before: 15, after: 15 }],
        'category', ['before', 'after'], x, y, w, h, [CHART_COLORS.orange, CHART_COLORS.secondary], v => `${v}%`, [0, 70]
      );
    }
    if (bulletIndex === 1) {
      return (doc, x, y, w, h) => drawMultiLineChart(doc,
        [{ scenario: 'Current', bonds: 100, stocks: 100 }, { scenario: '+1%', bonds: 95, stocks: 102 }, { scenario: '+2%', bonds: 90, stocks: 105 }, { scenario: '-1%', bonds: 105, stocks: 97 }, { scenario: '-2%', bonds: 110, stocks: 94 }],
        'scenario',
        [{ key: 'bonds', color: CHART_COLORS.primary, label: 'Bonds' }, { key: 'stocks', color: CHART_COLORS.accent, label: 'Stocks' }],
        x, y, w, h, [85, 115]
      );
    }
  }

  if (sectionId === 'next-actions') {
    if (bulletIndex === 0) {
      return (doc, x, y, w, h) => drawLineChart(doc,
        [{ year: 2024, balance: 245000 }, { year: 2026, balance: 295000 }, { year: 2028, balance: 348000 }, { year: 2030, balance: 405000 }, { year: 2032, balance: 468000 }],
        'year', 'balance', x, y, w, h, CHART_COLORS.secondary, v => `$${Math.round(v / 1000)}K`
      );
    }
    if (bulletIndex === 2) {
      return (doc, x, y, w, h) => drawBarChart(doc,
        [{ scenario: 'No Conversion', value: 450000 }, { scenario: 'With Conversion', value: 520000 }],
        'scenario', ['value'], x, y, w, h, [CHART_COLORS.primary], v => `$${Math.round(v / 1000)}K`
      );
    }
  }

  return null;
}

function renderExpansionContent(
  doc: jsPDF,
  data: ExpansionData,
  margin: number,
  contentWidth: number,
  pageHeight: number,
  getY: () => number,
  setY: (y: number) => void,
  sectionId?: string,
  bulletIndex?: number
) {
  let y = getY();
  const indent = margin + 10;
  const innerWidth = contentWidth - 15;

  const checkPageBreak = (needed: number) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Expansion title
  checkPageBreak(8);
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(data.title, indent, y);
  y += 5;

  // Overview metrics - render as a compact row
  checkPageBreak(12);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(indent, y - 3, innerWidth, 10, 1.5, 1.5, 'F');
  
  const metricWidth = innerWidth / data.overview.length;
  data.overview.forEach((item, i) => {
    const x = indent + i * metricWidth + 3;
    doc.setTextColor(120, 120, 120);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(item.label, x, y);
    doc.setTextColor(item.highlight ? 30 : 60, item.highlight ? 58 : 60, item.highlight ? 138 : 60);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, x, y + 5);
  });
  y += 12;

  // Chart
  if (sectionId !== undefined && bulletIndex !== undefined) {
    const chartFn = getChartForSection(sectionId, bulletIndex);
    if (chartFn) {
      const chartH = 35;
      const chartW = innerWidth - 15;
      checkPageBreak(chartH + 10);
      chartFn(doc, indent + 12, y, chartW, chartH);
      y += chartH + 14; // Extra whitespace below chart before Progress/Recommendations
    }
  }

  // Progress & Recommendations side by side
  const colWidth = (innerWidth - 5) / 2;
  const leftCol = indent;
  const rightCol = indent + colWidth + 5;

  // Estimate max height needed for both columns
  const progressHeight = data.milestones.length * 5 + 8;
  let recsHeight = 8;
  data.recommendations.forEach((rec) => {
    doc.setFontSize(8);
    const recLines = doc.splitTextToSize(rec, colWidth - 10);
    recsHeight += recLines.length * 4;
  });
  const maxColHeight = Math.max(progressHeight, recsHeight);
  checkPageBreak(maxColHeight + 4);

  const colStartY = y;

  // Left column: Progress
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Progress:', leftCol, y);
  let leftY = y + 4;

  data.milestones.forEach((milestone) => {
    if (milestone.status === 'completed') {
      doc.setFillColor(34, 139, 34);
      doc.circle(leftCol + 4.5, leftY - 1.2, 1.5, 'F');
      doc.setTextColor(34, 139, 34);
    } else {
      doc.setDrawColor(160, 160, 160);
      doc.setLineWidth(0.3);
      doc.circle(leftCol + 4.5, leftY - 1.2, 1.5, 'S');
      doc.setTextColor(160, 160, 160);
    }
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    const milestoneLines = doc.splitTextToSize(milestone.task, colWidth - 12);
    doc.text(milestoneLines, leftCol + 8, leftY);
    leftY += milestoneLines.length * 4 + 1;
  });

  // Right column: Recommendations
  let rightY = colStartY;
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations:', rightCol, rightY);
  rightY += 5;

  data.recommendations.forEach((rec) => {
    doc.setTextColor(70, 70, 70);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('-', rightCol + 3, rightY);
    const recLines = doc.splitTextToSize(rec, colWidth - 10);
    doc.text(recLines, rightCol + 8, rightY);
    rightY += recLines.length * 4;
  });

  y = Math.max(leftY, rightY) + 3;

  setY(y);
}
