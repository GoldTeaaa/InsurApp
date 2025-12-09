import { LaporanProduksiRow } from "@/lib/laporan/laporan-produksi/types";
import { formatDate, formatDateRange } from "@/lib/utils/formatDate";
import ExcelJS from "exceljs";

/**
 * Generates an Excel file from Laporan Produksi data.
 * @param data The array of production report rows.
 * @param startDate The start date for the report period.
 * @param endDate The end date for the report period.
 * @returns A Promise that resolves to a Blob representing the Excel file.
 */
export const generateProduksiExcel = async (
  data: LaporanProduksiRow[],
  startDate: string,
  endDate: string
): Promise<Blob> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Produksi");

  // === 1. DEFINE COLUMN STRUCTURE ===
  const columns = [
    { header: "No.", key: "no", width: 5 },
    { header: "Periode", key: "periode", width: 25 },
    { header: "Nomor Polis", key: "nomor_polis", width: 20 },
    { header: "Nama Tertanggung", key: "nama_tertanggung", width: 30 },
    { header: "Jenis Bisnis", key: "jenis_bisnis", width: 15 },
    { header: "Premi", key: "premi", width: 15, style: { numFmt: "#,##0.00" } },
    {
      header: "Discount",
      key: "discount",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Biaya Admin/Materai",
      key: "biaya_admin_materai",
      width: 20,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Premi Net",
      key: "premi_net",
      width: 15,
      style: { numFmt: "#,##0.00" },
    },
    {
      header: "Komisi",
      key: "komisi",
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
    { header: "No Kwitansi Komisi", key: "no_kwitansi_komisi", width: 20 },
    { header: "Nama Asuransi", key: "nama_perusahaan_asuransi", width: 30 },
    { header: "Jenis Coas", key: "jenis_coas", width: 15 },
    { header: "Share", key: "share", width: 10, style: { numFmt: '0.00"%"' } },
  ];
  worksheet.columns = columns;
  
  // === 2. ADD TITLE AND PERIOD HEADERS ===
  worksheet.mergeCells("A1:P1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Laporan Produksi";
  titleCell.font = { bold: true, size: 18 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };
  worksheet.getRow(1).height = 28;

  // Period row
  const period = `Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`;
  const periodRow = worksheet.addRow([period]);
  periodRow.height = 20;
  worksheet.mergeCells("A2:P2");
  const periodCell = worksheet.getCell("A2");
  periodCell.alignment = { horizontal: "center", vertical: "middle" };

  // Add a spacer row before the table headers
  worksheet.addRow([]);

  // === 3. ADD TABLE HEADERS ===
  const headerRow = worksheet.addRow(columns.map((col) => col.header)); // Add header row explicitly
  headerRow.font = { bold: true };
  // Apply styling to the newly added header row
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD3D3D3" },
    }; // Light grey fill
    cell.border = { bottom: { style: "thin" } };
  });

  // === 4. GROUP DATA AND ADD DATA ROWS WITH SUBTOTALS ===
  const groupedData = data.reduce((acc, row) => {
    (acc[row.nomor_polis] = acc[row.nomor_polis] || []).push(row);
    return acc;
  }, {} as Record<string, LaporanProduksiRow[]>);

  const grandTotals = {
    premi: 0,
    discount: 0,
    biaya_admin_materai: 0,
    premi_net: 0,
    komisi: 0,
    pph_komisi: 0,
    komisi_net: 0,
  };

  let rowNumber = 1;
  const policyGroups = Object.values(groupedData);
  policyGroups.forEach((group, index) => {
    group.forEach((row) => {
      worksheet.addRow({
        no: rowNumber++,
        ...row,
        periode: formatDateRange(row.periode_mulai, row.periode_akhir),
      });
      // Aggregate grand totals
      grandTotals.premi += row.premi;
      grandTotals.discount += row.discount;
      grandTotals.biaya_admin_materai += row.biaya_admin_materai;
      grandTotals.premi_net += row.premi_net;
      grandTotals.komisi += row.komisi;
      grandTotals.pph_komisi += row.pph_komisi;
      grandTotals.komisi_net += row.komisi_net;
    });

    // Add subtotal row for co-insurance groups
    if (group.length > 1) {
      const subTotals = group.reduce(
        (acc, row) => {
          acc.premi += row.premi;
          acc.discount += row.discount;
          acc.biaya_admin_materai += row.biaya_admin_materai;
          acc.premi_net += row.premi_net;
          acc.komisi += row.komisi;
          acc.pph_komisi += row.pph_komisi;
          acc.komisi_net += row.komisi_net;
          return acc;
        },
        {
          premi: 0,
          discount: 0,
          biaya_admin_materai: 0,
          premi_net: 0,
          komisi: 0,
          pph_komisi: 0,
          komisi_net: 0,
        }
      );

      const subtotalRow = worksheet.addRow({
        // jenis_bisnis: `Total Polis ${group[0].nomor_polis}}`,
        jenis_bisnis: `Total`,
        premi: subTotals.premi,
        discount: subTotals.discount,
        biaya_admin_materai: subTotals.biaya_admin_materai,
        komisi: subTotals.komisi,
        premi_net: subTotals.premi_net,
        pph_komisi: subTotals.pph_komisi,
        komisi_net: subTotals.komisi_net,
      });
      subtotalRow.font = { bold: true, italic: true };
      subtotalRow.getCell("C").alignment = { horizontal: "right" };
    }

  });

  // === 5. ADD GRAND TOTAL FOOTER ===
  worksheet.addRow([]); // Spacer row
  const footerRow = worksheet.addRow({
    jenis_bisnis: "TOTAL",
    premi: grandTotals.premi,
    discount: grandTotals.discount,
    biaya_admin_materai: grandTotals.biaya_admin_materai,
    premi_net: grandTotals.premi_net,
    komisi: grandTotals.komisi,
    pph_komisi: grandTotals.pph_komisi,
    komisi_net: grandTotals.komisi_net,
  });
  footerRow.font = { bold: true, size: 12 };
  footerRow.getCell("C").alignment = { horizontal: "right" };
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
