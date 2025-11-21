const mockPolicies = [
    { id: 'POL-001', client: 'John Doe', type: 'Auto', premium: '$1,200', status: 'Active' },
    { id: 'POL-002', client: 'Jane Smith', type: 'Home', premium: '$2,500', status: 'Active' },
    { id: 'POL-003', client: 'Acme Inc.', type: 'Business', premium: '$15,000', status: 'Pending' },
    { id: 'POL-004', client: 'Peter Jones', type: 'Life', premium: '$800', status: 'Active' },
];

export function RecentPolicies() {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow">
            <div className="p-6">
                <h3 className="font-semibold tracking-tight">Recent Policies</h3>
            </div>
            <div className="p-6 pt-0">
                <div className="space-y-4">
                    {mockPolicies.map((policy) => (
                        <div key={policy.id} className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{policy.client}</p>
                                <p className="text-sm text-muted-foreground">{policy.type} - {policy.id}</p>
                            </div>
                            <div className="ml-auto font-medium">{policy.premium}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}