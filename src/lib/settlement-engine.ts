export interface Transaction {
  from: string; // The person who owes money (debtor)
  to: string; // The person who is owed money (creditor)
  amount: number;
}

export interface OptimalSettlement {
  from: string;
  to: string;
  amount: number;
}

/**
 * AI Debt Simplification Engine
 * Mathematically reduces the total number of transactions required to settle debts within a group.
 * 
 * @param transactions Array of all pending transactions in a group
 * @returns Array of optimal minimum transactions to settle all debts
 */
export function simplifyDebts(transactions: Transaction[]): OptimalSettlement[] {
  // 1. Calculate net balances for each participant
  const balances: Record<string, number> = {};

  for (const t of transactions) {
    if (!balances[t.from]) balances[t.from] = 0;
    if (!balances[t.to]) balances[t.to] = 0;

    // 'from' owes money, so their balance goes down (debtor)
    balances[t.from] -= t.amount;
    // 'to' is owed money, so their balance goes up (creditor)
    balances[t.to] += t.amount;
  }

  // 2. Separate into Debtors and Creditors
  const debtors = [];
  const creditors = [];

  for (const [person, balance] of Object.entries(balances)) {
    if (balance < -0.01) {
      debtors.push({ person, balance: Math.abs(balance) }); // store as positive debt
    } else if (balance > 0.01) {
      creditors.push({ person, balance });
    }
  }

  // 3. Sort by largest amounts to optimize large transactions first (greedy approach)
  debtors.sort((a, b) => b.balance - a.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  // 4. Match Debtors with Creditors
  const optimalSettlements: OptimalSettlement[] = [];
  let d = 0; // debtor index
  let c = 0; // creditor index

  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];

    // Find the minimum amount that can be settled between these two
    const settlementAmount = Math.min(debtor.balance, creditor.balance);

    if (settlementAmount > 0.01) {
      optimalSettlements.push({
        from: debtor.person,
        to: creditor.person,
        // Round to 2 decimal places to avoid floating point issues
        amount: Number(settlementAmount.toFixed(2)),
      });
    }

    // Adjust balances
    debtor.balance -= settlementAmount;
    creditor.balance -= settlementAmount;

    // Move to next if fully settled (allowing for tiny floating point variations)
    if (debtor.balance < 0.01) {
      d++;
    }
    if (creditor.balance < 0.01) {
      c++;
    }
  }

  return optimalSettlements;
}
