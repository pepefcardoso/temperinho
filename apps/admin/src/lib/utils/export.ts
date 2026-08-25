export function exportToCsv<T>(data: T[], filename: string) {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }

  // Get headers from the first object
  const headers = Object.keys(data[0] as object);

  // Convert each row to CSV string
  const csvRows = data.map((row) => {
    return headers
      .map((header) => {
        const val = (row as any)[header];
        if (val === null || val === undefined) {
          return '""';
        }
        // Escape quotes and wrap in quotes to handle commas within values
        const strVal = String(val).replace(/"/g, '""');
        return `"${strVal}"`;
      })
      .join(",");
  });

  // Combine headers and rows
  const csvString = [headers.join(","), ...csvRows].join("\n");

  // Create a Blob and trigger download
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
