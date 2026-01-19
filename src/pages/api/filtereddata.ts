import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface ProvinceData {
  province: string;
  model: string;
  TMEAN_C: string;
  ANOMALY_C: number;
  experiment: string;
  YEAR: string;
}

// Function to filter CSV
function getFilteredData(selectedProvince: string, selectedModel?: string) {
  const csvPath = path.resolve('public/resources/provinces_TMean_Anomaly_V3_AllModels.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records: ProvinceData[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  let filtered = records.filter(r => r.province === selectedProvince);

  if (selectedModel && selectedModel !== 'Multi-model') {
    filtered = filtered.filter(r => r.model === selectedModel);
  }
  // Map to the shape your frontend expects
  return filtered.map(r => ({
    year: r.YEAR,
    data: r.ANOMALY_C, // make sure this is a number, not string
    experiment: r.experiment
  }));
  //return filtered.map(r => ({ year: r.YEAR, data: r.ANOMALY_C }));
}

// Astro GET endpoint
export const GET: APIRoute = ({ url }) => {
  const province = url.searchParams.get('province') || '';
  const model = url.searchParams.get('model') || '';

  if (!province) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const data = getFilteredData(province, model);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
