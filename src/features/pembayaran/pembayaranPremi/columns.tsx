import { ColumnDef } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import { PembayaranTableRow } from '@/lib/pembayaran/pembayaran_premi/types';
import PembayaranPremiDropdown from './PembayaranPremiDropdown';
import { getStatusClass } from '@/lib/utils/getStatusBadge';
import { formatCurrencyIDR } from '@/lib/utils/formatCurrencyIDR';

export type PembayaranTableMeta = {
  onRowClick: (id: string) => void;
}

export const columns: ColumnDef<PembayaranTableRow>[] = [
  {
    accessorKey: 'nomor_polis',
    header: 'Nomor Polis',
    cell: ({ row, table }) => {
      const premiRowId = row.original.id;
      const nomor_polis = row.getValue<string>('nomor_polis');
      const { onRowClick } = table.options.meta as PembayaranTableMeta;

      return (
        <button
          // variant="link"
          className="p-0 text-center hover:underline "
          onClick={() => onRowClick(premiRowId)}
        >
          {nomor_polis}
        </button>
      );
    }
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
    header: 'Status Pembayaran',
    cell: ({ getValue }) => {
      const status = getValue<string>();

      return <span className={getStatusClass(status)}>{status.replace('_', ' ')}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const pembayaran = row.original;
      const { onRowClick } = table.options.meta as PembayaranTableMeta;
      return (
        <PembayaranPremiDropdown
          pembayaranPremiId={pembayaran.id}
          onRowClick={onRowClick}
        />
      )
    }
  },
];