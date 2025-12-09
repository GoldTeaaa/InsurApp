import { PelunasanPremiRow } from "@/lib/laporan/laporan-pelunasan-premi/types";
import { formatDate, formatDateRange } from "@/lib/utils/formatDate";
import ExcelJS from "exceljs";

/**
 * Generates an Excel file from Laporan Pelunasan Premi data.
 * @param data The array of pelunasan premi report rows.
 * @param startDate The start date for the report period.
 * @param endDate The end date for the report period.
 * @returns A Promise that resolves to a Blob representing the Excel file.
 */
export default async function generatePelunasanPremiExcel(
  data: PelunasanPremiRow[],
  startDate: string,
  endDate: string
): Promise<Blob>{
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Pelunasan Premi");

  // === 1. DEFINE COLUMN STRUCTURE ===
  const columns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Periode Polis", key: "periode", width: 25 },
    { header: "No. Polis", key: "nomor_polis", width: 20 },
    { header: "Nama Tertanggung", key: "nama_tertanggung", width: 30 },
    { header: "Jenis Bisnis", key: "bisnis", width: 15 },
    { header: "Asuransi", key: "nama_perusahaan_asuransi", width: 30 },
    { header: "Keterangan", key: "jenis_coas", width: 15 },
    { header: "Share", key: "share", width: 10, style: { numFmt: "0%" } },
    { header: "Status", key: "status", width: 15 },
    { header: "Tanggal Bayar", key: "tanggal_bayar", width: 15, style: { numFmt: 'dd-mm-yyyy' } },
    { header: "Premi Gross", key: "premi_gross", width: 15, style: { numFmt: "#,##0.00" } },
    { header: "Discount", key: "discount", width: 15, style: { numFmt: "#,##0.00" } },
    { header: "Biaya Admin/Materai", key: "biaya_admin_materai", width: 20, style: { numFmt: "#,##0.00" } },
    { header: "Premi Net", key: "premi_net", width: 15, style: { numFmt: "#,##0.00" } },
    { header: "Amount Paid", key: "amount_paid", width: 15, style: { numFmt: "#,##0.00" } },
  ];
  worksheet.columns = columns;

  // === 2. ADD TITLE AND PERIOD HEADERS ===
  const lastColumn = String.fromCharCode(65 + columns.length - 1);
  worksheet.mergeCells(`A1:${lastColumn}1`);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Laporan Pelunasan Premi";
  titleCell.font = { bold: true, size: 18 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 28;

  const period = `Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`;
  worksheet.mergeCells(`A2:${lastColumn}2`);
  const periodCell = worksheet.getCell("A2");
  periodCell.value = period;
  periodCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(2).height = 20;

  worksheet.addRow([]); // Spacer row

  // === 3. ADD TABLE HEADERS ===
  const headerRow = worksheet.addRow(columns.map((col) => col.header));
  headerRow.font = { bold: true };
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" }, // Light grey
    };
    cell.border = { bottom: { style: "thin" } };
  });

  // === 4. ADD DATA ROWS ===
  let rowNumber = 1;
  data.forEach((row) => {
    worksheet.addRow({
      no: rowNumber++,
      ...row,
      periode: formatDateRange(row.periode_mulai, row.periode_akhir),
      share: row.share / 100, // Convert to a decimal for Excel's percentage format
      tanggal_bayar: row.tanggal_bayar ? new Date(row.tanggal_bayar) : "-",
    });
  });

  // === 5. ADD GRAND TOTAL FOOTER ===
  const grandTotals = data.reduce(
    (acc, row) => {
      acc.premi_gross += row.premi_gross;
      acc.discount += row.discount;
      acc.biaya_admin_materai += row.biaya_admin_materai;
      acc.premi_net += row.premi_net;
      acc.amount_paid += row.amount_paid ?? 0;
      return acc;
    },
    {
      premi_gross: 0,
      discount: 0,
      biaya_admin_materai: 0,
      premi_net: 0,
      amount_paid: 0,
    }
  );

  worksheet.addRow([]); // Spacer row
  const footerRow = worksheet.addRow({
    nama_tertanggung: "TOTAL",
    premi_gross: grandTotals.premi_gross,
    discount: grandTotals.discount,
    biaya_admin_materai: grandTotals.biaya_admin_materai,
    premi_net: grandTotals.premi_net,
    amount_paid: grandTotals.amount_paid,
  });

  footerRow.font = { bold: true, size: 12 };
  footerRow.getCell("D").alignment = { horizontal: "right" };
  footerRow.eachCell((cell, colNumber) => {
    // Style only the cells with content
    if (colNumber > 4) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" },
      };
      cell.border = { top: { style: "double" } };
    }
  });

  // === 6. GENERATE AND RETURN BLOB ===
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};