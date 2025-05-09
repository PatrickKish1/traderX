"use client"

import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { Search } from 'lucide-react'

interface Token {
  id: string
  symbol: string
  name: string
}

interface TokenSearchProps {
  onSelect: (token: Token) => void
}

const TOKEN_CACHE_KEY = 'cached_tokens_list';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function TokenSearch({ onSelect }: TokenSearchProps) {
  const [value, setValue] = useState("")
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      // Check cache first
      const cached = localStorage.getItem(TOKEN_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setTokens(data);
          return;
        }
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/crypto/tokens');
        if (!response.ok) throw new Error('Failed to fetch tokens');
        
        const data = await response.json();
        setTokens(data);
        
        // Cache the results
        localStorage.setItem(TOKEN_CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setError('Failed to load tokens');
        
        // Try to use cached data even if expired
        const cached = localStorage.getItem(TOKEN_CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setTokens(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []); // Only fetch once on mount

  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(value.toLowerCase()) ||
    token.symbol.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <Command className="relative rounded-lg border shadow-md">
      <div className="flex items-center border-b px-3">
        <Search className="h-4 w-4 shrink-0 opacity-50" />
        <Command.Input
          placeholder="Search tokens..."
          className="flex h-10 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          value={value}
          onValueChange={setValue}
        />
      </div>
      <Command.List className="max-h-[300px] overflow-y-auto p-2">
        {loading ? (
          <Command.Loading>Loading tokens...</Command.Loading>
        ) : error ? (
          <div className="p-2 text-sm text-red-500">{error}</div>
        ) : filteredTokens.length === 0 ? (
          <div className="p-2 text-sm text-gray-500">No tokens found</div>
        ) : (
          filteredTokens.map(token => (
            <Command.Item
              key={token.id}
              value={token.id}
              onSelect={() => {
                onSelect(token);
                setValue("");
              }}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-accent"
            >
              <span className="font-bold">{token.symbol}</span>
              <span className="text-muted-foreground">{token.name}</span>
            </Command.Item>
          ))
        )}
      </Command.List>
    </Command>
  )
}
