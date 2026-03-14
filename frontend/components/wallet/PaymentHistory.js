export default function PaymentHistory({ payments = [] }) {
  if (payments.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-10 text-center text-sm text-muted">
        No payment history yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-surface text-left text-xs font-medium uppercase tracking-wider text-muted">
            <th className="px-5 py-3">Project</th>
            <th className="px-5 py-3">Milestone</th>
            <th className="px-5 py-3">Amount</th>
            <th className="px-5 py-3">Payout</th>
            <th className="px-5 py-3">Date</th>
            <th className="px-5 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {payments.map((payment) => (
            <tr
              key={payment._id || payment.id}
              className="transition-colors hover:bg-card-hover"
            >
              <td className="px-5 py-3.5 font-medium text-foreground">
                {payment.projectTitle || "—"}
              </td>
              <td className="px-5 py-3.5 text-muted">
                {payment.milestoneTitle || "—"}
              </td>
              <td className="px-5 py-3.5 font-semibold text-foreground">
                ${(payment.amount || 0).toLocaleString()}
              </td>
              <td className={`px-5 py-3.5 font-bold ${
                payment.payoutPercent === 100
                  ? "text-success"
                  : payment.payoutPercent === 70
                  ? "text-warning"
                  : "text-danger"
              }`}>
                {payment.payoutPercent != null ? `${payment.payoutPercent}%` : "—"}
              </td>
              <td className="px-5 py-3.5 text-muted">
                {payment.date
                  ? new Date(payment.date).toLocaleDateString()
                  : payment.createdAt
                  ? new Date(payment.createdAt).toLocaleDateString()
                  : "—"}
              </td>
              <td className="px-5 py-3.5">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                  payment.status === "completed"
                    ? "bg-success-subtle text-success"
                    : payment.status === "pending"
                    ? "bg-warning-subtle text-warning"
                    : "bg-surface text-muted"
                }`}>
                  {payment.status || "—"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
