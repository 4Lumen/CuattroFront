import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Item } from '../services/itemService';

type CartItem = {
  item: Item;
  quantity: number;
};

export type PDFMode = 'standard' | 'detailed';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

function removeEmojis(text: string): string {
  return text.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
}

async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function calculateItemHeight(doc: jsPDF, item: Item, description: string): number {
  const baseHeight = 70; // Base height for item (image, name, basic details)
  
  if (!description) return baseHeight;

  const maxWidth = doc.internal.pageSize.width - 90;
  const wrappedDescription = doc.splitTextToSize(description, maxWidth);
  const lineHeight = 6;
  const descriptionHeight = wrappedDescription.length * lineHeight;
  
  return baseHeight + descriptionHeight;
}

export const generateOrderPDF = async (items: CartItem[], mode: PDFMode = 'standard'): Promise<void> => {
  const doc = new jsPDF();
  const now = new Date();
  
  const dateStr = now.toISOString().slice(0, 19).replace(/[-:]/g, '').replace('T', '_');
  const filename = `pedido_${dateStr}.pdf`;

  const primaryColor = '#FFA500';
  const textColor = '#333333';
  const secondaryTextColor = '#666666';
  
  // Define RGB colors
  const primaryRGB = [255, 165, 0]; // #FFA500
  const secondaryRGB = [51, 51, 51]; // #333333
  const paperRGB = [255, 255, 255]; // #FFFFFF

  // Add title
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('Pedido', 105, 30, { align: 'center' });

  // Add date and time
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(secondaryTextColor);
  doc.text(`Data: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, 45);

  let startY = 55;
  const pageHeight = doc.internal.pageSize.height;
  const marginBottom = 40; // Space needed at bottom of page for footer

  if (mode === 'detailed') {
    // Add detailed item information with images
    for (const { item, quantity } of items) {
      // Calculate total height needed for this item
      const cleanDescription = item.descricao ? `Descrição: ${removeEmojis(item.descricao)}` : '';
      const itemHeight = calculateItemHeight(doc, item, cleanDescription);
      
      // Check if item will fit on current page
      if (startY + itemHeight > pageHeight - marginBottom) {
        doc.addPage();
        startY = 20;
      }

      // Add image if available
      if (item.imagemUrl) {
        try {
          const imageData = await loadImage(item.imagemUrl);
          doc.addImage(imageData, 'JPEG', 20, startY, 40, 40);
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }

      // Item name (remove emojis)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(textColor);
      doc.text(removeEmojis(item.nome), 70, startY + 15);

      // Basic details
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(secondaryTextColor);
      
      const basicDetails = [
        `Quantidade: ${item.quantidade * quantity} ${item.unidadeMedida}`,
        `Preço Unitário: R$ ${item.preco.toFixed(2)}`,
        `Subtotal: R$ ${(item.preco * quantity).toFixed(2)}`
      ];

      basicDetails.forEach((detail, index) => {
        doc.text(detail, 70, startY + 25 + (index * 10));
      });

      // Description with wrapping (remove emojis)
      if (item.descricao) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        
        // Calculate available width for description
        const maxWidth = doc.internal.pageSize.width - 90;
        const wrappedDescription = doc.splitTextToSize(cleanDescription, maxWidth);

        // Add each line of the wrapped description
        wrappedDescription.forEach((line: string, index: number) => {
          doc.text(line, 70, startY + 55 + (index * 6));
        });

        // Update startY based on description height
        startY += itemHeight;
      } else {
        startY += 70;
      }

      // Add separator line if not the last item
      if (items.indexOf({ item, quantity }) < items.length - 1) {
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(20, startY - 10, doc.internal.pageSize.width - 20, startY - 10);
      }
    }

    // Add total
    // Check if we need a new page for the total
    if (startY + 30 > pageHeight - marginBottom) {
      doc.addPage();
      startY = 20;
    }

    const total = items.reduce((sum, { item, quantity }) => sum + (item.preco * quantity), 0);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor);
    doc.text(`Total: R$ ${total.toFixed(2)}`, doc.internal.pageSize.width - 20, startY + 10, { align: 'right' });
  } else {
    // Standard mode table (remove emojis from names)
    const tableData = items.map(({ item, quantity }) => [
      removeEmojis(item.nome),
      `${item.quantidade * quantity} ${item.unidadeMedida}`,
      `R$ ${item.preco.toFixed(2)}`,
      `R$ ${(item.preco * quantity).toFixed(2)}`
    ]);

    const total = items.reduce((sum, { item, quantity }) => sum + (item.preco * quantity), 0);

    doc.autoTable({
      startY: 55,
      head: [['Produto', 'Quantidade', 'Preço Unitário', 'Subtotal']],
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
        cellPadding: 4,
        textColor: secondaryRGB
      },
      columnStyles: {
        0: { cellWidth: 'auto', fontStyle: 'bold' },
        1: { cellWidth: 40, halign: 'center' },
        2: { cellWidth: 40, halign: 'right' },
        3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 20, right: 20, bottom: 20, left: 20 }
    });
  }

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
      doc.internal.pageSize.height - 20,
      { align: 'right' }
    );
    
    // Add company info
    doc.text(
      'Cuattro',
      20,
      doc.internal.pageSize.height - 20
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