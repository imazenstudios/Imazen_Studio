import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateEventPdf = (event, discount = 0) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', reject);

      const logoPath = path.join(__dirname, '../frontend/public/images/logo.png');
      const hasLogo = fs.existsSync(logoPath);

      // Colors
      const bgColor = '#0f0f0f';
      const whiteColor = '#ffffff';
      const grayColor = '#888888';
      const lightGrayColor = '#cccccc';

      // Helper to draw background without affecting layout position
      const drawBackground = () => {
        const oldY = doc.y;
        const oldX = doc.x;
        doc.rect(0, 0, doc.page.width, doc.page.height).fill(bgColor);
        doc.x = oldX;
        doc.y = oldY;
      };

      // Ensure background is drawn on automatically added pages
      doc.on('pageAdded', () => {
        drawBackground();
      });

      // Fetch settings first, then generate PDF
      import('./models/Settings.js').then(({ default: Settings }) => {
        Settings.findOne().then(settings => {
          settings = settings || {};
          
          const addressText = (settings.footerStudioAddress || '123 Studio Street, Creative District\nCity, State, 12345').split(/\r?\n/);
          const phoneText = settings.whatsappNumber || '(123) 456-7890';
          const emailText = settings.contactEmail || 'imazenstudios@gmail.com';

          // --- PAGE 1: Cover Page ---
          drawBackground();
          
          if (hasLogo) {
            doc.image(logoPath, (doc.page.width - 350) / 2, (doc.page.height - 150) / 2, { width: 350 });
          } else {
            doc.font('Helvetica-Bold').fontSize(40).fillColor(whiteColor).text('IMAZEN STUDIOS', 0, (doc.page.height - 40) / 2, { align: 'center' });
          }

          // --- PAGE 2: Content ---
          doc.addPage();
          doc.y = 50; // Reset Y after addPage

          // Header on subsequent pages
          if (hasLogo) {
            doc.image(logoPath, 50, 40, { width: 150 });
          } else {
            doc.font('Helvetica-Bold').fontSize(24).fillColor(whiteColor).text('IMAZEN STUDIOS', 50, 50);
          }

          // Quote on the right
          doc.font('Times-Bold').fontSize(24).fillColor(whiteColor)
             .text(`${event.name || 'Event'} Quote`.toUpperCase(), 50, 75, { align: 'right', width: doc.page.width - 100 });

          // Top line separator
          const separatorY = 110;
          doc.moveTo(50, separatorY).lineTo(doc.page.width - 50, separatorY).strokeColor(grayColor).lineWidth(1).stroke();

          // Title & Date
          doc.y = separatorY + 30;
          doc.font('Helvetica').fontSize(12).fillColor(lightGrayColor).text(`Date: ${event.date || new Date().toISOString().split('T')[0]}`, 50, doc.y);

          // Two Columns: Client Details & Event Logistics
          doc.y += 60;
          const startY = doc.y;

          // Client Box
          doc.rect(50, startY, 230, 100).fillColor('#1a1a1a').fill();
          doc.font('Helvetica-Bold').fontSize(10).fillColor(whiteColor).text('CLIENT DETAILS', 65, startY + 15);
          doc.font('Helvetica').fontSize(10).fillColor(grayColor)
             .text(`Name:`, 65, startY + 35).fillColor(lightGrayColor).text(event.clientName || 'N/A', 110, startY + 35)
             .fillColor(grayColor).text(`Email:`, 65, startY + 55).fillColor(lightGrayColor).text(event.email || 'N/A', 110, startY + 55)
             .fillColor(grayColor).text(`Phone:`, 65, startY + 75).fillColor(lightGrayColor).text(event.phone || 'N/A', 110, startY + 75);

          // Logistics Box
          doc.rect(doc.page.width - 50 - 230, startY, 230, 100).fillColor('#1a1a1a').fill();
          doc.font('Helvetica-Bold').fontSize(10).fillColor(whiteColor).text('EVENT DETAILS', doc.page.width - 50 - 215, startY + 15);
          const subEventNames = event.subEventList && event.subEventList.length > 0 ? event.subEventList.map(s => s.name).join(', ') : (event.subEvents || 'N/A');
          doc.font('Helvetica').fontSize(10).fillColor(grayColor)
             .text(`Event:`, doc.page.width - 50 - 215, startY + 35).fillColor(lightGrayColor).text(event.name || 'N/A', doc.page.width - 50 - 160, startY + 35)
             .fillColor(grayColor).text(`Sub-Events:`, doc.page.width - 50 - 215, startY + 55).fillColor(lightGrayColor).text(subEventNames, doc.page.width - 50 - 140, startY + 55);


          doc.y = startY + 130;

          // Services Table Header
          doc.font('Helvetica-Bold').fontSize(12).fillColor(whiteColor).text('ITEMISED SERVICE BREAKDOWN', 50, doc.y);
          doc.y += 10;
          
          const tableTop = doc.y;
          doc.rect(50, tableTop, doc.page.width - 100, 25).fillColor('#1a1a1a').fill();
          doc.font('Helvetica-Bold').fontSize(10).fillColor(grayColor)
             .text('EVENT / SERVICE DESCRIPTION', 65, tableTop + 8)
             .text('TOTAL COST', doc.page.width - 150, tableTop + 8, { width: 85, align: 'right' });

          doc.y = tableTop + 35;

          const services = event.services || [];
          const subEventList = event.subEventList || [];
          let calculatedTotal = 0;
          
          doc.font('Helvetica').fontSize(10).fillColor(lightGrayColor);
          if (subEventList.length > 0) {
            subEventList.forEach(sub => {
              doc.font('Times-Bold').fillColor(whiteColor).text(`${sub.name}`, 65, doc.y);
              doc.y += 5;
              doc.font('Helvetica').fillColor(lightGrayColor);
              if (sub.services && sub.services.length > 0) {
                sub.services.forEach(service => {
                  doc.text(`- ${service.name}`, 75, doc.y);
                  doc.text(`Rs. ${service.price.toLocaleString()}/-`, doc.page.width - 150, doc.y - 10, { width: 85, align: 'right' });
                  calculatedTotal += service.price;
                  doc.y += 10;
                });
              } else {
                doc.text(`- No services`, 75, doc.y);
                doc.y += 10;
              }
              doc.y += 5;
            });
          } else if (services.length > 0) {
            services.forEach(service => {
              doc.text(`- ${service.name}`, 65, doc.y);
              doc.text(`Rs. ${service.price.toLocaleString()}/-`, doc.page.width - 150, doc.y - 10, { width: 85, align: 'right' });
              calculatedTotal += service.price;
              doc.y += 10;
            });
          } else {
            doc.text('- No services listed.', 65, doc.y);
            calculatedTotal = event.totalAmount || 0;
            doc.y += 20;
          }

          const deliverables = (event.deliverables || []).filter(d => d.trim() !== '');
          if (deliverables.length > 0) {
            doc.y += 10;
            doc.font('Times-Bold').fontSize(11).fillColor(whiteColor).text('DELIVERABLES', 50, doc.y);
            doc.y += 10;
            doc.font('Helvetica').fontSize(10).fillColor(lightGrayColor);
            deliverables.forEach(del => {
              doc.text(`- ${del}`, 65, doc.y);
              doc.y += 10;
            });
          }

          const complimentries = (event.complimentries || []).filter(c => c.trim() !== '');
          if (complimentries.length > 0) {
            doc.y += 10;
            doc.font('Times-Bold').fontSize(11).fillColor(whiteColor).text('COMPLIMENTARIES', 50, doc.y);
            doc.y += 10;
            doc.font('Helvetica').fontSize(10).fillColor(lightGrayColor);
            complimentries.forEach(comp => {
              doc.text(`- ${comp}`, 65, doc.y);
              doc.y += 10;
            });
          }

          doc.moveDown(2);

          // Discount and Totals Table
          const numericDiscount = Number(discount) || 0;
          const finalAmount = Math.max(0, calculatedTotal - numericDiscount);

          const summaryTop = doc.y;
          doc.rect(50, summaryTop, doc.page.width - 100, (numericDiscount > 0 ? 85 : 55)).fillColor('#1a1a1a').fill();
          
          let currY = summaryTop + 15;
          
          if (numericDiscount > 0) {
            doc.font('Helvetica-Bold').fontSize(11).fillColor(grayColor)
               .text('SUBTOTAL:', 65, currY)
               .fillColor(lightGrayColor).text(`Rs. ${calculatedTotal.toLocaleString()}/-`, doc.page.width - 200, currY, { width: 135, align: 'right' });
            
            currY += 20;
            
            doc.font('Helvetica-Bold').fontSize(11).fillColor(grayColor)
               .text('DISCOUNT:', 65, currY)
               .fillColor(whiteColor).text(`- Rs. ${numericDiscount.toLocaleString()}/-`, doc.page.width - 200, currY, { width: 135, align: 'right' });
               
            currY += 20;
          }

          doc.font('Helvetica-Bold').fontSize(14).fillColor(whiteColor)
             .text('ESTIMATED TOTAL COST:', 65, currY)
             .fontSize(16).text(`Rs. ${finalAmount.toLocaleString()}/-`, doc.page.width - 250, currY - 2, { width: 185, align: 'right' });

          doc.moveTo(50, currY + 30).lineTo(doc.page.width - 50, currY + 30).strokeColor(grayColor).lineWidth(1).stroke();
          doc.moveTo(50, currY + 34).lineTo(doc.page.width - 50, currY + 34).strokeColor(grayColor).lineWidth(0.5).stroke();

          // --- PAGE 3: Contact Details (Like 3rd image) ---
          doc.addPage();
          doc.y = 50; // Reset Y
          
          const contactLogoY = (doc.page.height - 250) / 2;
          if (hasLogo) {
            doc.image(logoPath, (doc.page.width - 250) / 2, contactLogoY, { width: 250 });
          } else {
            doc.font('Helvetica-Bold').fontSize(30).fillColor(whiteColor).text('IMAZEN STUDIOS', 0, contactLogoY + 100, { align: 'center' });
          }

          // Contact Info below the logo
          doc.y = contactLogoY + 200; // Position below logo
          doc.font('Helvetica-Bold').fontSize(16).fillColor(whiteColor).text('Contact details', { align: 'center' });
          doc.moveDown(1);
          doc.font('Helvetica').fontSize(12).fillColor(grayColor)
             .text(`Phone : ${phoneText}`, { align: 'center' })
             .text(`Email: ${emailText}`, { align: 'center' })
             .moveDown(0.5)
             .text('www.imazenstudios.com', { align: 'center' });

          // --- Footer for all pages ---
          const pages = doc.bufferedPageRange();
          for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            doc.font('Helvetica').fontSize(8).fillColor(grayColor).text(
              `Page ${i + 1} of ${pages.count}`,
              0,
              doc.page.height - 40,
              { align: 'center', lineBreak: false }
            );
          }

          doc.end();
        }).catch(reject);
      }).catch(reject);

    } catch (err) {
      reject(err);
    }
  });
};
