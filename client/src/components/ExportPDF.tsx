import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Button } from './ui/button';

interface ExportToPDFProps<T extends object> {
  data: T[];
  fileName: string;
  title: string;
}

function ExportPDF<T extends object>({
  data,
  fileName,
  title,
}: ExportToPDFProps<T>) {
  const handleExport = () => {
    const doc = new jsPDF();

    // Add the title to the PDF
    doc.setFontSize(16); // Set font size for title
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the page width
    const titleWidth = doc.getTextWidth(title); // Get the title's width
    const titleXPosition = (pageWidth - titleWidth) / 2; // Calculate the x position to center the title

    doc.text(title, titleXPosition, 20); // Add the title at the center, with a y-position of 20

    const tableColumn = Object.keys(data[0]) as (keyof T)[];
    const tableRows = data.map((item) =>
      tableColumn.map((key) => String(item[key])),
    );

    autoTable(doc, {
      head: [tableColumn.map(String)],
      body: tableRows,
      startY: 30, // Start the table below the title
    });

    doc.save(`${fileName}.pdf`);
  };

  return (
    <Button className="rounded-md bg-green-500" onClick={handleExport}>
      GENERATE PDF
    </Button>
  );
}
export { ExportPDF };
