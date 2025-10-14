"use client";

type AsuransiPenanggungCellProps = {
  insurers: string | null;
};

export default function AsuransiPenanggungCell({ insurers }: AsuransiPenanggungCellProps) {
  if (!insurers) {
    return <span className="text-gray-500">-</span>;
  }

  const insurerList = insurers.split(",").map(name => name.trim());

  return (
    <div className="flex flex-col items-start gap-1">
      {insurerList.map((insurer, index) => (
        <span
          key={index}
          className="inline-block rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700"
        >
          {insurer}
        </span>
      ))}
    </div>
  );
}