/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner';
import { fetchMarketPrice } from '@/lib/api/coinbase';
import { useTradeStore } from '@/lib/stores/tradeStore';

interface AiTradeSuggestionsProps {
  market: string;
  onSuggestionSelect: (suggestion: any) => void;
}

export default function AiTradeSuggestions({ market, onSuggestionSelect }: AiTradeSuggestionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const { addTrade } = useTradeStore();

  const getAiSuggestion = async () => {
    try {
      setIsLoading(true);
      
      // Get current market price
      const currentPrice = await fetchMarketPrice(market);
      
      // Get AI prediction
      const response = await fetch(`/api/crypto/predict?symbol=${market}&price=${currentPrice}`);
      if (!response.ok) throw new Error('Failed to get prediction');
      
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error getting AI suggestion:', error);
      toast.error('Failed to get AI trading suggestion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = () => {
    if (!prediction) return;

    // Add the trade directly to the store
    addTrade({
      symbol: market,
      type: prediction.direction,
      amount: 0.001, // Default small amount
      price: prediction.price,
      takeProfit: prediction.takeProfit,
      stopLoss: prediction.stopLoss
    });

    // Also pass to order form for display
    onSuggestionSelect({
      type: prediction.direction,
      pair: market,
      amount: '0.001',
      price: prediction.price.toString(),
      takeProfitPrice: prediction.takeProfit.toString(),
      stopLossPrice: prediction.stopLoss.toString(),
    });

    toast.success('AI trade executed and applied to order form');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="gap-2" 
          onClick={getAiSuggestion}
          disabled={isLoading}
        >
          <Brain size={16} />
          {isLoading ? 'Analyzing...' : 'Get AI Trade Suggestion'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Trade Suggestion</DialogTitle>
          <DialogDescription>
            Based on market analysis and patterns
          </DialogDescription>
        </DialogHeader>

        {prediction ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="mb-2">
                <span className="font-medium">Direction: </span>
                <span className={prediction.direction === 'buy' ? 'text-green-500' : 'text-red-500'}>
                  {prediction.direction.toUpperCase()}
                </span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Target Price: </span>
                ${prediction.price.toFixed(2)}
              </div>
              <div className="mb-2">
                <span className="font-medium">Take Profit: </span>
                <span className="text-green-500">${prediction.takeProfit.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Stop Loss: </span>
                <span className="text-red-500">${prediction.stopLoss.toFixed(2)}</span>
              </div>
              <div className="mb-2">
                <span className="font-medium">Confidence: </span>
                {prediction.confidence.toFixed(1)}%
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                {prediction.reasoning}
              </div>
            </div>

            <Button onClick={handleApplySuggestion} className="w-full">
              Apply to Order Form
            </Button>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Brain className="animate-pulse" />
                Analyzing market conditions...
              </div>
            ) : (
              'No prediction available'
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
