import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { StoredAnalysis } from '@/lib/storage';

export interface PDFGenerationOptions {
  includeCharts?: boolean;
  includeTimeline?: boolean;
  includeAdvancedCharts?: boolean;
  includeRawData?: boolean;
  watermark?: string;
}

export class PDFReportGenerator {
  private pdf: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private pageWidth: number = 210; // A4 width in mm
  private margin: number = 20;
  private lineHeight: number = 7;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pdf.setFontSize(12);
  }

  private checkPageBreak(height: number = 10): void {
    if (this.currentY + height > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addText(text: string, x: number = this.margin, fontSize: number = 12, isBold: boolean = false): void {
    this.pdf.setFontSize(fontSize);
    if (isBold) {
      this.pdf.setFont(undefined, 'bold');
    } else {
      this.pdf.setFont(undefined, 'normal');
    }
    
    // Handle text wrapping
    const splitText = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    
    for (const line of splitText) {
      this.checkPageBreak();
      this.pdf.text(line, x, this.currentY);
      this.currentY += this.lineHeight;
    }
  }

  private addTitle(text: string, fontSize: number = 16): void {
    this.checkPageBreak(15);
    this.currentY += 5;
    this.addText(text, this.margin, fontSize, true);
    this.currentY += 5;
  }

  private addSection(title: string, content: string): void {
    this.addTitle(title, 14);
    this.addText(content);
    this.currentY += 5;
  }

  private async addChartFromElement(elementId: string, title: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with ID ${elementId} not found for PDF export`);
      this.addTitle(title, 12);
      this.addText(`[Chart could not be rendered: ${title} - Element not found]`, this.margin, 10);
      return;
    }

    try {
      // Add title for the chart
      this.addTitle(title, 12);

      // Wait for charts to render completely
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Temporarily make element visible for capture
      const originalStyle = {
        position: element.style.position,
        left: element.style.left,
        opacity: element.style.opacity,
        zIndex: element.style.zIndex,
        pointerEvents: element.style.pointerEvents,
      };
      
      element.style.position = 'fixed';
      element.style.left = '0px';
      element.style.opacity = '1';
      element.style.zIndex = '9999';
      element.style.pointerEvents = 'auto';
      
      // Wait a bit more for the repositioning
      await new Promise(resolve => setTimeout(resolve, 200));

      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 1.5,
        logging: true,
        useCORS: true,
        allowTaint: true,
        width: 800,
        height: 400,
        onclone: (clonedDoc) => {
          // Ensure the cloned element is visible
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.position = 'static';
            clonedElement.style.opacity = '1';
            clonedElement.style.visibility = 'visible';
          }
        }
      });
      
      // Restore original styles
      element.style.position = originalStyle.position;
      element.style.left = originalStyle.left;
      element.style.opacity = originalStyle.opacity;
      element.style.zIndex = originalStyle.zIndex;
      element.style.pointerEvents = originalStyle.pointerEvents;

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Check if we need a new page for the image
      this.checkPageBreak(imgHeight + 10);

      this.pdf.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 10;
    } catch (error) {
      console.error('Failed to add chart to PDF:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.addText(`[Chart could not be rendered: ${title} - ${errorMessage}]`, this.margin, 10);
    }
  }

  private addHeader(analysis: StoredAnalysis): void {
    // Company/App header
    this.pdf.setFontSize(20);
    this.pdf.setFont(undefined, 'bold');
    this.pdf.text('ITL DeepFake Detection Report', this.pageWidth / 2, 15, { align: 'center' });

    this.currentY = 30;

    // File info header
    this.pdf.setFontSize(16);
    this.pdf.setFont(undefined, 'bold');
    this.pdf.text(`Analysis Report: ${analysis.filename}`, this.margin, this.currentY);
    this.currentY += 10;

    this.pdf.setFontSize(10);
    this.pdf.setFont(undefined, 'normal');
    this.pdf.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, this.margin, this.currentY);
    this.currentY += 5;
    this.pdf.text(`Analysis Date: ${new Date(analysis.timestamp).toLocaleDateString()}`, this.margin, this.currentY);
    this.currentY += 10;

    // Add a separator line
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 10;
  }

  private addFooter(): void {
    const pageCount = this.pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setFont(undefined, 'normal');
      this.pdf.text(
        `Page ${i} of ${pageCount} | Generated by ITL DeepFake Detection System`,
        this.pageWidth / 2,
        this.pageHeight - 10,
        { align: 'center' }
      );
    }
  }

  private addExecutiveSummary(analysis: StoredAnalysis): void {
    this.addTitle('Executive Summary', 16);
    
    const riskLevel = analysis.confidence < 0.3 ? 'LOW' : analysis.confidence < 0.7 ? 'MODERATE' : 'HIGH';
    const riskColor = analysis.confidence < 0.3 ? 'green' : analysis.confidence < 0.7 ? 'orange' : 'red';
    
    const summary = `
File: ${analysis.filename}
Risk Level: ${riskLevel} (${Math.round(analysis.confidence * 100)}% confidence)
Prediction: ${analysis.prediction}
Processing Time: ${Math.round(analysis.processingTime / 1000)} seconds
File Size: ${(analysis.fileSize / (1024 * 1024)).toFixed(2)} MB
File Type: ${analysis.fileType}

Analysis Results:
The file has been analyzed using advanced deepfake detection algorithms. Based on the analysis, this content has a ${riskLevel.toLowerCase()} probability of being artificially generated or manipulated. The confidence score of ${Math.round(analysis.confidence * 100)}% indicates the system's certainty in this assessment.

${analysis.prediction === 'authentic' 
  ? 'The content appears to be authentic with no significant signs of artificial manipulation detected.'
  : 'The content shows signs of potential artificial generation or manipulation and should be treated with caution.'
}
`;

    this.addText(summary);
  }

  private addTechnicalDetails(analysis: StoredAnalysis): void {
    this.addTitle('Technical Analysis Details', 16);
    
    // File metadata
    this.addSection('File Metadata', `
Type: ${analysis.fileType}
Size: ${(analysis.fileSize / (1024 * 1024)).toFixed(2)} MB
Duration: ${analysis.details.metadata.duration ? Math.round(analysis.details.metadata.duration) + 's' : 'N/A'}
Resolution: ${analysis.details.metadata.resolution || 'N/A'}
Analysis ID: ${analysis.id}
`);

    // Processing details
    this.addSection('Processing Information', `
Processing Time: ${Math.round(analysis.processingTime / 1000)} seconds
Analysis Algorithm: Reality Defender API
Timestamp: ${new Date(analysis.timestamp).toLocaleString()}
`);

    // Detailed results
    if (analysis.details.categoryBreakdown) {
      this.addSection('Category Analysis', 
        Object.entries(analysis.details.categoryBreakdown)
          .map(([category, score]) => `${category}: ${score}%`)
          .join('\n')
      );
    }

    // Frame analysis if available
    if (analysis.details.frameAnalysis) {
      this.addSection('Frame Analysis', `
Total Frames Analyzed: ${analysis.details.frameAnalysis.length}
Average Frame Confidence: ${(analysis.details.frameAnalysis.reduce((sum, frame) => sum + frame.confidence, 0) / analysis.details.frameAnalysis.length * 100).toFixed(1)}%
Suspicious Frames: ${analysis.details.frameAnalysis.filter(frame => frame.confidence > 0.7).length}
`);
    }

    // Audio analysis if available
    if (analysis.details.audioAnalysis) {
      this.addSection('Audio Analysis', `
Audio Segments Analyzed: ${analysis.details.audioAnalysis.segments.length}
Average Audio Confidence: ${(analysis.details.audioAnalysis.segments.reduce((sum, seg) => sum + seg.confidence, 0) / analysis.details.audioAnalysis.segments.length * 100).toFixed(1)}%
Audio Anomalies Found: ${analysis.details.audioAnalysis.segments.filter(seg => seg.anomalies && seg.anomalies.length > 0).length}
`);
    }
  }

  private addDisclaimer(): void {
    this.addTitle('Disclaimer and Limitations', 14);
    
    const disclaimer = `
IMPORTANT NOTICE:

1. Accuracy Limitations: While this deepfake detection system uses advanced AI algorithms, no detection system is 100% accurate. Results should be considered as one factor in content verification, not as definitive proof.

2. Technology Evolution: Deepfake generation technology is rapidly evolving. New techniques may not be detected by current algorithms.

3. Context Matters: Consider the source, context, and other verification methods when evaluating content authenticity.

4. Legal Considerations: This report is provided for informational purposes only and should not be used as sole evidence in legal proceedings without additional verification.

5. Data Privacy: Analysis data is processed according to our privacy policy. No content is stored permanently on our servers after analysis.

6. Technical Support: For questions about this report or the analysis methodology, contact our technical support team.

Generated by ITL DeepFake Detection System v1.0
Powered by Reality Defender API
`;

    this.addText(disclaimer, this.margin, 10);
  }

  public async generateReport(
    analysis: StoredAnalysis,
    options: PDFGenerationOptions = {}
  ): Promise<Blob> {
    try {
      // Reset PDF state
      this.currentY = 20;

      // Add header
      this.addHeader(analysis);

      // Add executive summary
      this.addExecutiveSummary(analysis);

      // Add charts if requested
      if (options.includeCharts !== false) {
        this.checkPageBreak(50);
        this.addTitle('Visual Analysis', 16);
        
        // Add confidence gauge
        await this.addChartFromElement('confidence-gauge-pdf', 'Confidence Analysis');
        
        // Add category breakdown
        if (analysis.details.categoryBreakdown) {
          await this.addChartFromElement('category-chart-pdf', 'Category Breakdown');
        }
      }

      // Add timeline analysis if requested
      if (options.includeTimeline !== false) {
        await this.addChartFromElement('timeline-chart-pdf', 'Timeline Analysis');
      }

      // Add advanced charts if requested
      if (options.includeAdvancedCharts) {
        await this.addChartFromElement('risk-heatmap-pdf', 'Risk Analysis Heatmap');
        await this.addChartFromElement('anomaly-scatter-pdf', 'Anomaly Detection');
        await this.addChartFromElement('radar-chart-pdf', 'Multidimensional Analysis');
      }

      // Add technical details
      this.addTechnicalDetails(analysis);

      // Add raw data if requested
      if (options.includeRawData) {
        this.addTitle('Raw Analysis Data', 16);
        this.addText(JSON.stringify(analysis, null, 2), this.margin, 8);
      }

      // Add disclaimer
      this.addDisclaimer();

      // Add footer to all pages
      this.addFooter();

      // Generate PDF blob
      const pdfBlob = new Blob([this.pdf.output('blob')], { type: 'application/pdf' });
      
      return pdfBlob;

    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      throw new Error('Failed to generate PDF report. Please try again.');
    }
  }

  public downloadReport(analysis: StoredAnalysis, options: PDFGenerationOptions = {}): Promise<void> {
    return this.generateReport(analysis, options).then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `itl-deepfake-analysis-${analysis.filename}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }
}

// Export a singleton instance
export const pdfGenerator = new PDFReportGenerator();