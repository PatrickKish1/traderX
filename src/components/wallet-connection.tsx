'use client';
import { 
  Wallet, 
  ConnectWallet, 
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownDisconnect
} from '@coinbase/onchainkit/wallet';
import {
  Avatar,
  Name,
  Address,
  Identity,
  EthBalance
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { useTheme } from '@/lib/context/theme-context';

interface WalletConnectionProps {
  className?: string;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ className }) => {
  const { address, isConnected } = useAccount();
  const {  } = useTheme();

  address?.toString()
  isConnected.valueOf.toString()
  
  return (
    <div className={className}>
      <Wallet>
        <ConnectWallet>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity 
            className="px-4 pt-3 pb-2" 
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name />
            <Address />
            <EthBalance />
          </Identity>
          <WalletDropdownBasename />
          <WalletDropdownFundLink />
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

export default WalletConnection;