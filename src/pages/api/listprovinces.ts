//listprovinces.ts
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import { ref, computed } from 'vue';

interface ProvinceData {
    province: string;
    model: string;
    TMEAN_C: string;
    ANOMALY_C: number;
    experiment: string;
    YEAR: string;
}

export function getProvincesData() {
    // Path to CSV
    const csvPath = path.resolve("public/resources/provinces_TMean_Anomaly_V3_AllModels.csv");

    // Read CSV file
    const fileContent = fs.readFileSync(csvPath, "utf-8");

    // Parse CSV
    const records: ProvinceData[] = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });

    // Get unique values
    const provinces = Array.from(new Set(records.map(r => r.province))).sort();
    const models = Array.from(new Set(records.map(r => r.model))).sort();
    models.push("Multi-model");

    const selectedProvince = ref('');
    const selectedModel = ref(''); // optional
    const selectedData = ref('ANOMALY_C');


    const filteredData = computed(() => {
    if (!selectedProvince.value) return [];
    return records
        .filter(r => r.province === selectedProvince.value &&
                    (!selectedModel.value || r.model === selectedModel.value))
        .map(r => ({ year: r.YEAR, data: r[selectedData.value as keyof typeof r] }));
    });

    return { provinces, models };
}