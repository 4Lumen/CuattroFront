import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Item } from '../services/itemService';

type CartItem = {
  item: Item;
  quantity: number;
};

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const generateOrderPDF = (items: CartItem[]): void => {
  // Create PDF with custom fonts
  const doc = new jsPDF();
  const now = new Date();
  
  // Format date and time for filename
  const dateStr = now.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
  const filename = `pedido_${dateStr}.pdf`;

  // Set primary color
  const primaryColor = '#FFA500';
  const textColor = '#333333';
  const secondaryTextColor = '#666666';

  // Add title using Playfair Display style
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Pedido', 105, 30, { align: 'center' });

  // Add date and time using Roboto style
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(secondaryTextColor);
  doc.text(`Data: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, 45);

  // Prepare table data
  const tableData = items.map(({ item, quantity }) => [
    item.nome,
    quantity.toString(),
    `R$ ${item.preco.toFixed(2)}`,
    `R$ ${(item.preco * quantity).toFixed(2)}`
  ]);

  // Calculate total
  const total = items.reduce((sum, { item, quantity }) => sum + (item.preco * quantity), 0);

  // Convert primary color hex to RGB
  const primaryRGB = [255, 165, 0]; // #FFA500
  const secondaryRGB = [51, 51, 51]; // #333333
  const paperRGB = [255, 255, 255]; // #FFFFFF

  // Add table with theme styling
  doc.autoTable({
    startY: 55,
    head: [['Produto', 'QTD', 'Preço Unitário', 'Subtotal']],
    body: tableData,
    foot: [['', '', 'Total:', `R$ ${total.toFixed(2)}`]],
    theme: 'grid',
    headStyles: {
      fillColor: primaryRGB,
      textColor: paperRGB,
      fontStyle: 'bold',
      fontSize: 12,
      cellPadding: { top: 10, right: 5, bottom: 10, left: 5 },
      lineWidth: 0
    },
    footStyles: {
      fillColor: secondaryRGB,
      textColor: paperRGB,
      fontStyle: 'bold',
      fontSize: 12,
      cellPadding: { top: 10, right: 5, bottom: 10, left: 5 }
    },
    styles: {
      font: 'helvetica',
      fontSize: 11,
      cellPadding: 8,
      textColor: secondaryRGB
    },
    columnStyles: {
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245] // #F5F5F5
    },
    margin: { top: 20, right: 20, bottom: 20, left: 20 }
  });

  // Add footer with page numbers and company info
  const pageCount = doc.getNumberOfPages();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(secondaryTextColor);
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Add page number
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 10,
      { align: 'right' }
    );
    
    // Add company info
    doc.text(
      'Buffet App',
      20,
      doc.internal.pageSize.height - 10
    );
  }

  // Add decorative border
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(primaryRGB[0], primaryRGB[1], primaryRGB[2]);
    doc.setLineWidth(1);
    doc.rect(
      10,
      10,
      doc.internal.pageSize.width - 20,
      doc.internal.pageSize.height - 20
    );
  }

  // Download PDF
  doc.save(filename);
};