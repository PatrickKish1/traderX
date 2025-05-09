/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { Wallet, DollarSign, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchAccounts } from "@/lib/api/coinbase"
import { toast } from "sonner"

export default function AccountSummary() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setIsLoading(true)
      const accountsData = await fetchAccounts()
      setAccounts(accountsData)
    } catch (error) {
      toast.error("Error",{
        description: "Failed to load account data",
      })
      console.error("Failed to load accounts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate total balance in USD
  const totalBalance = accounts.reduce((total, account) => {
    if (account.available_balance && account.available_balance.currency === "USD") {
      return total + Number.parseFloat(account.available_balance.value)
    }
    // For non-USD currencies, we would need to convert using current rates
    return total
  }, 0)

  return (
    <div className="bg-card rounded-lg p-4 border border-border w-full md:w-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold flex items-center gap-2">
          <Wallet size={16} />
          Account Summary
        </h2>
        <Button variant="ghost" size="icon" onClick={loadAccounts} disabled={isLoading} className="h-8 w-8">
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Total Balance</div>
          <div className="text-xl font-bold flex items-center">
            <DollarSign size={16} />
            {isLoading
              ? "Loading..."
              : totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={() => window.open("https://www.coinbase.com/accounts", "_blank")}>
          Deposit
        </Button>
      </div>
    </div>
  )
}
