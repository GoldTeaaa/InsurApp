import { LaporanPelunasanKomisiRow } from "@/lib/laporan/laporan-pelunasan-komisi/types";
import { formatDate, formatDateRange } from "@/lib/utils/formatDate";
import ExcelJS from "exceljs";

/**
 * Generates an Excel file from Laporan Pelunasan Komisi data.
 * @param data The array of pelunasan komisi report rows.
 * @param startDate The start date for the report period.
 * @param endDate The end date for the report period.
 * @returns A Promise that resolves to a Blob representing the Excel file.
 */
export default async function generatePelunasanKomisiExcel(
  data: LaporanPelunasanKomisiRow[],
  startDate: string,
  endDate: string
): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Pelunasan Komisi");

  // === 1. DEFINE COLUMN STRUCTURE ===
  const columns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Periode", key: "periode", width: 25 },
    { header: "Nomor Polis", key: "nomor_polis", width: 20 },
    { header: "Nama Tertanggung", key: "nama_tertanggung", width: 30 },
    { header: "Bisnis", key: "bisnis", width: 15 },
    { header: "No Kwitansi", key: "no_kwitansi", width: 20 },
    {
      header: "Komisi Gross",
      key: "komisi_gross",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "PPH Komisi",
      key: "pph_komisi",    
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Komisi Net",
      key: "komisi_net",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    { header: "Nama Asuransi", key: "nama_perusahaan_asuransi", width: 30 },
    { header: "Jenis Coas", key: "jenis_coas", width: 15 },
    { header: "Share", key: "share", width: 10, style: { numFmt: "0%" } },
    {
      header: "Tanggal Bayar",
      key: "tanggal_bayar",
      width: 15,
      style: { numFmt: "dd-mm-yyyy" },
    },
    { header: "Status", key: "status", width: 15 },
  ];
  worksheet.columns = columns;

  // === 2. ADD TITLE AND PERIOD HEADERS ===
  const lastColumn = String.fromCharCode(65 + columns.length - 1); // e.g., 'N' for 14 columns
  worksheet.mergeCells(`A1:${lastColumn}1`);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Laporan Pelunasan Komisi";
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
      share: row.share / 100, // Convert to a decimal for Excel's percentage format
      periode: formatDateRange(row.periode_mulai, row.periode_akhir),
      tanggal_bayar: row.tanggal_bayar ? new Date(row.tanggal_bayar) : "-",
    });
  });

  // === 5. ADD GRAND TOTAL FOOTER ===
  const grandTotals = data.reduce(
    (acc, row) => {
      acc.komisi_gross += row.komisi_gross;
      acc.pph_komisi += row.pph_komisi;
      acc.komisi_net += row.komisi_net;
      return acc;
    },
    {
      komisi_gross: 0,
      pph_komisi: 0,
      komisi_net: 0,
    }
  );

  worksheet.addRow([]); // Spacer row
  const footerRow = worksheet.addRow({
    nama_tertanggung: "TOTAL",
    komisi_gross: grandTotals.komisi_gross,
    pph_komisi: grandTotals.pph_komisi,
    komisi_net: grandTotals.komisi_net,
  });

  footerRow.font = { bold: true, size: 12 };
  footerRow.getCell("D").alignment = { horizontal: "right" }; // Align 'TOTAL' text
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
}
