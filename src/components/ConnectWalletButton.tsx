'use client'

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { celoMainnet } from "@/utils/contract";

const ConnectWalletButton = () => {
  const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string;

  if (!clientId) {
    console.error('NEXT_PUBLIC_THIRDWEB_CLIENT_ID is not set');
    return null;
  }

  const client = createThirdwebClient({ clientId });

  return (
    <ConnectButton
      client={client}
      chain={celoMainnet}
      chains={[celoMainnet]}
      theme="dark"
      connectModal={{
        size: "compact",
        title: "Connect to Celo Mainnet",
        showThirdwebBranding: false,
      }}
      autoConnect={{
        timeout: 15000,
      }}
      switchButton={{
        label: "Wrong Network - Switch to Celo Mainnet",
        style: {
          backgroundColor: "#dc2626",
        },
      }}
    />
  );
};

export default ConnectWalletButton;
