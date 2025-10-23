import { ColumnDef } from '@tanstack/react-table';

export type Pembayaran = {
  nomor_polis: string;
  nama: string;
  created_at: string; // Assuming it comes as an ISO string or similar
  premi_net: number;
  status: string;
};

export const columns: ColumnDef<Pembayaran>[] = [
  {
    accessorKey: 'nomor_polis',
    header: 'Nomor Polis',
    // You can add a cell renderer here if you want to make it a link or add an icon
  },
  {
    accessorKey: 'nama',
    header: 'Nama Nasabah', // More descriptive header
  },
  {
    accessorKey: 'created_at',
    header: 'Tanggal Dibuat',
    cell: ({ getValue }) => {
      const dateString = getValue<string>();
      if (!dateString) return '-';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      } catch (e) {
        console.error('Error parsing date:', dateString, e);
        return dateString; // Fallback to raw string if parsing fails
      }
    },
  },
  {
    accessorKey: 'premi_net',
    header: 'Premi Net',
    cell: ({ getValue }) => {
      const amount = getValue<number>();
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0, // Adjust as needed
        maximumFractionDigits: 2, // Adjust as needed
      }).format(amount);
    },
  },
  {
    accessorKey: 'status',
    header: 'Status Pembayaran', // More descriptive header
    // You could add conditional styling here based on the status value
    // cell: ({ getValue }) => {
    //   const status = getValue<string>();
    //   let color = '';
    //   switch (status) {
    //     case 'paid': color = 'text-green-500'; break;
    //     case 'pending': color = 'text-yellow-500'; break;
    //     case 'overdue': color = 'text-red-500'; break;
    //     default: color = 'text-gray-500';
    //   }
    //   return <span className={color}>{status}</span>;
    // },
  },
  // You might want to add an 'Actions' column for edit/delete buttons
  // {
  //   id: 'actions',
  //   header: 'Aksi',
  //   cell: ({ row }) => (
  //     <div className="flex gap-2">
  //       <button className="text-blue-600 hover:underline">Edit</button>
  //       <button className="text-red-600 hover:underline">Hapus</button>
  //     </div>
  //   ),
  // },
];