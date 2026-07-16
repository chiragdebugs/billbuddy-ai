export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert objects to CSV string
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(","));
  
  // Add rows
  for (const row of data) {
    const values = headers.map((header) => {
      const val = row[header];
      // Escape quotes and wrap in quotes to handle commas within values
      const escaped = ("" + (val ?? "")).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  const csvString = csvRows.join("\n");
  
  // Trigger download
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
