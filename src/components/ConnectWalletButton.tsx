'use client'

import { createThirdwebClient } from "thirdweb";
import { ConnectButton } from "thirdweb/react";
import { u2uTestnet } from "@/utils/contract";

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
      chain={u2uTestnet}
      chains={[u2uTestnet]}
      theme="dark"
      connectModal={{
        size: "compact",
        title: "Connect to U2U Testnet",
        showThirdwebBranding: false,
      }}
      autoConnect={{
        timeout: 15000,
      }}
      switchButton={{
        label: "Wrong Network - Switch to U2U Testnet",
        style: {
          backgroundColor: "#dc2626",
        },
      }}
    />
  );
};

export default ConnectWalletButton;
