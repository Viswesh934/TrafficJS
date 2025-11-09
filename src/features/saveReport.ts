// moved from src/saveReport.ts
import fs from "fs";
import path from "path";

export interface ReportData {
  [key: string]: any;
}

export async function saveReport(data: ReportData): Promise<string> {
  const dir = path.join(process.cwd(), "reports");
  
  // Create reports directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `report-${timestamp}.json`;
  const filePath = path.join(dir, filename);
  
  // Add timestamp to data
  const reportData = {
    ...data,
    timestamp: new Date().toISOString(),
    generatedAt: new Date().toLocaleString()
  };
  
  fs.writeFileSync(filePath, JSON.stringify(reportData, null, 2));
  console.log(`✅ Report saved: ${filename}`);
  
  return filename;
}