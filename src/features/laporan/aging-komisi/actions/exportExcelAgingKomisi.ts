import { LaporanAgingKomisiItem } from "@/lib/laporan/laporan-aging-komisi/types";
import { formatDate, formatDateRange } from "@/lib/utils/formatDate";
import ExcelJS from "exceljs";

/**
 * Generates an Excel file from Laporan Aging Komisi data.
 * @param data The array of aging report rows.
 * @param startDate The start date for the report period.
 * @param endDate The end date for the report period.
 * @returns A Promise that resolves to a Blob representing the Excel file.
 */
export const generateAgingKomisiExcel = async (
  data: LaporanAgingKomisiItem[],
  startDate: string,
  endDate: string
): Promise<Blob> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Aging Komisi");

  // === 1. DEFINE COLUMN STRUCTURE ===
  const columns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Periode", key: "periode", width: 25 },
    { header: "Nomor Polis", key: "nomor_polis", width: 20 },
    { header: "Nama Tertanggung", key: "nama_tertanggung", width: 30 },
    { header: "Nama Asuransi", key: "nama_perusahaan_asuransi", width: 30 },
    {
      header: "Komisi Gross",
      key: "komisi_gross",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "PPH",
      key: "pph",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Komisi Net",
      key: "komisi_net",
      width: 20,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Amount Due",
      key: "amount_due",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Amount Paid",
      key: "amount_paid",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    { header: "Status", key: "detail_komisi_status", width: 15 },
    { header: "Aging (Hari)", key: "aging_bracket", width: 15 },
  ];
  worksheet.columns = columns;

  // === 2. ADD TITLE AND PERIOD HEADERS ===
  const lastColumn = String.fromCharCode(65 + columns.length - 1);
  worksheet.mergeCells(`A1:${lastColumn}1`);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Laporan Aging Komisi";
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
    });
  });

  // === 5. ADD GRAND TOTAL FOOTER ===
  const grandTotals = data.reduce(
    (acc, row) => {
      acc.komisi_gross += row.komisi_gross;
      acc.pph += row.pph;
      acc.komisi_net += row.komisi_net;
      acc.amount_due += row.amount_due ?? 0;
      acc.amount_paid += row.amount_paid ?? 0;
      return acc;
    },
    { komisi_gross: 0, pph: 0, komisi_net: 0, amount_due: 0, amount_paid: 0 }
  );

  worksheet.addRow([]); // Spacer row
  const footerRow = worksheet.addRow({
    nama_tertanggung: "TOTAL",
    komisi_gross: grandTotals.komisi_gross,
    pph: grandTotals.pph,
    komisi_net: grandTotals.komisi_net,
    amount_due: grandTotals.amount_due,
    amount_paid: grandTotals.amount_paid,
  });

  footerRow.font = { bold: true, size: 12 };
  footerRow.getCell("D").alignment = { horizontal: "right" };
  footerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    };
    cell.border = { top: { style: "double" } };
  });

  // === 6. GENERATE AND RETURN BLOB ===
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
};