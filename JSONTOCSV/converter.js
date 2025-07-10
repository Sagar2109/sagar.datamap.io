function convertJSONtoCSV() {
  const input = document.getElementById('jsonInput').value;
  let jsonData;

  try {
    jsonData = JSON.parse(input);
  } catch (e) {
    alert('Invalid JSON!');
    return;
  }

  // Ensure it's an array
  if (!Array.isArray(jsonData)) {
    jsonData = [jsonData];
  }

  if (jsonData.length === 0) {
    alert('Empty JSON array!');
    return;
  }

  // Extract unique headers
  const headers = [...new Set(jsonData.flatMap(obj => Object.keys(flattenObject(obj))))];

  // Build CSV rows
  const csvRows = [headers.join(',')];
  jsonData.forEach(item => {
    const flatItem = flattenObject(item);
    const row = headers.map(header => {
      const val = flatItem[header] !== undefined ? flatItem[header] : '';
      return `"${String(val).replace(/"/g, '""')}"`; // escape quotes
    });
    csvRows.push(row.join(','));
  });

  document.getElementById('csvOutput').value = csvRows.join('\n');
}

function flattenObject(obj, prefix = '', res = {}) {
  for (const key in obj) {
    const propName = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

function copyCSV() {
  const output = document.getElementById('csvOutput');
  output.select();
  output.setSelectionRange(0, 99999);
  document.execCommand('copy');
  alert('CSV copied to clipboard!');
}

function downloadCSV() {
    convertJSONtoCSV();
    const output = document.getElementById('csvOutput').value;
    const csvFile = new Blob([output], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = "data.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
