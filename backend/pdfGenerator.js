import PDFDocument from 'pdfkit';

export const generateEventPdf = (event, discount = 0) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(20)
        .text('Imazen Studios', { align: 'center' })
        .moveDown();
        
      doc
        .fontSize(16)
        .text('Event Summary', { align: 'center', underline: true })
        .moveDown(2);

      // Event Details
      doc.fontSize(12)
         .text(`Event Name: ${event.name}`)
         .text(`Date: ${event.date || new Date().toISOString().split('T')[0]}`)
         .text(`Client Name: ${event.clientName || 'N/A'}`)
         .text(`Email: ${event.email || 'N/A'}`)
         .text(`Phone: ${event.phone || 'N/A'}`)
         .text(`Status: ${event.status || 'N/A'}`)
         .moveDown(2);

      // Services
      doc.fontSize(14).text('Services Included', { underline: true }).moveDown(1);
      
      const services = event.services || [];
      let calculatedTotal = 0;
      
      if (services.length === 0) {
        doc.fontSize(12).text('No services listed.');
        calculatedTotal = event.totalAmount || 0;
      } else {
        services.forEach(service => {
          doc.fontSize(12).text(`${service.name}: \u20B9${service.price.toLocaleString()}`);
          calculatedTotal += service.price;
        });
      }
      doc.moveDown();

      // Discount (if any)
      const numericDiscount = Number(discount) || 0;
      const finalAmount = Math.max(0, calculatedTotal - numericDiscount);

      doc.fontSize(12).text(`Subtotal: \u20B9${calculatedTotal.toLocaleString()}`);
      if (numericDiscount > 0) {
        doc.text(`Discount: -\u20B9${numericDiscount.toLocaleString()}`);
      }
      doc.moveDown();
      doc.fontSize(14).text(`Total Amount: \u20B9${finalAmount.toLocaleString()}`, { bold: true });
      doc.fontSize(12).text(`Paid Amount: \u20B9${(event.paidAmount || 0).toLocaleString()}`);
      
      const pending = Math.max(0, finalAmount - (event.paidAmount || 0));
      doc.text(`Pending Amount: \u20B9${pending.toLocaleString()}`);

      doc.moveDown(4);
      doc.fontSize(10).text('Thank you for choosing Imazen Studios!', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
