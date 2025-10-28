import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { PembayaranTableRow } from '@/lib/pembayaran/pembayaran_premi/types';
import PembayaranPremiDropdown from './PembayaranPremiDropdown';
import { getStatusClass } from '@/lib/utils/getStatusBadge';
import { formatCurrencyIDR } from '@/lib/utils/formatCurrencyIDR';

export const columns: ColumnDef<PembayaranTableRow>[] = [
  {
    accessorKey: 'nomor_polis',
    header: 'Nomor Polis',
    // You can add a cell renderer here if you want to make it a link or add an icon
  },
  {
    accessorKey: 'nama_tertanggung',
    header: 'Nama Nasabah', // More descriptive header
  },
  {
    accessorKey: 'asuransi_penanggung',
    header: 'Asuransi Penanggung',
  },
  {
    accessorKey: 'tanggal_input',
    header: 'Tanggal Dibuat',
    cell: ({ getValue }) => {
      const dateString = getValue<string>();
      if (!dateString) return '-';
      const date = parseISO(dateString);
      return format(date, 'dd MMMM yyyy');
    },
  },
  {
    accessorKey: 'amount',
    header: 'Premi Net',
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return formatCurrencyIDR(amount);
    },
  },
  {
    accessorKey: 'total_paid',
    header: 'Total Pembayaran',
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return formatCurrencyIDR(amount);
    },
  },
  {
    accessorKey: 'remaining',
    header: 'Sisa Pembayaran',
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return formatCurrencyIDR(amount);
    }
  },
  {
    accessorKey: 'status',
    header: 'Status Pembayaran', // More descriptive header
    // You could add conditional styling here based on the status value
    cell: ({ getValue }) => {
      const status = getValue<string>();

      return <span className={getStatusClass(status)}>{status.replace('_', ' ')}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const pembayaran = row.original;
      return (
        <PembayaranPremiDropdown
          id={pembayaran.id}
        />
      )
    }
  },
];